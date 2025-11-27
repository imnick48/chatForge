from flask import Blueprint, request, jsonify
from ..extensions import limiter
from ..services.sentiment_service import analyze_message_sentiment
from ..utils.analysis_utils import analyze_sentiment_trend
from datetime import datetime

analyze_bp = Blueprint('analyze', __name__)


@analyze_bp.route('/analyze', methods=['POST'])
@limiter.limit("20 per minute")
def analyze():
    try:
        data = request.json
        messages = data.get('messages', [])

        user_messages = [msg for msg in messages if msg['role'] == 'user']

        if not user_messages:
            return jsonify({
                'error': 'No user messages to analyze',
                'status': 'error'
            }), 400

        message_sentiments = []
        positive_count = 0
        negative_count = 0
        neutral_count = 0

        for msg in user_messages:
            sentiment = analyze_message_sentiment(msg['content'])
            message_sentiments.append({
                'message': msg['content'],
                'sentiment': sentiment,
                'timestamp': msg.get('timestamp', '')
            })

            if sentiment == 'Positive':
                positive_count += 1
            elif sentiment == 'Negative':
                negative_count += 1
            else:
                neutral_count += 1

        total_messages = len(user_messages)
        positive_ratio = positive_count / total_messages if total_messages > 0 else 0
        negative_ratio = negative_count / total_messages if total_messages > 0 else 0

        if positive_count > negative_count and positive_count > neutral_count:
            overall_sentiment = 'Positive'
        elif negative_count > positive_count and negative_count > neutral_count:
            overall_sentiment = 'Negative'
        else:
            overall_sentiment = 'Neutral'

        sentiment_trend = analyze_sentiment_trend(message_sentiments)

        return jsonify({
            'overall_sentiment': overall_sentiment,
            'positive_count': positive_count,
            'negative_count': negative_count,
            'neutral_count': neutral_count,
            'total_messages': total_messages,
            'positive_ratio': positive_ratio,
            'negative_ratio': negative_ratio,
            'message_sentiments': message_sentiments,
            'sentiment_trend': sentiment_trend,
            'status': 'success',
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        print(f"Error in analyze endpoint: {str(e)}")
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500
