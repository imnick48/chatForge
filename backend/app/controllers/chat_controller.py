from flask import Blueprint, request, jsonify
from ..extensions import limiter
from ..utils.simple_responses import get_simple_response
from ..services.openrouter_service import call_openrouter_api

chat_bp = Blueprint('chat', __name__)


@chat_bp.route('/chat', methods=['POST'])
@limiter.limit("30 per minute")
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        history = data.get('history', [])
        use_simple = data.get('use_simple', True)  # Option to use simple responses

        if not user_message:
            return jsonify({
                'response': 'Please provide a message.',
                'status': 'error'
            }), 400

        # Check for simple response first if enabled
        if use_simple:
            simple_response = get_simple_response(user_message)
            if simple_response:
                return jsonify({
                    'response': simple_response,
                    'status': 'success',
                    'type': 'simple'
                })

        # Prepare messages for OpenRouter
        messages = []
        for msg in history:
            messages.append({
                "role": msg['role'],
                "content": msg['content']
            })

        # Add current user message
        messages.append({
            "role": "user",
            "content": user_message
        })

        # Call OpenRouter API (delegated to service)
        assistant_message = call_openrouter_api(messages)

        from datetime import datetime
        return jsonify({
            'response': assistant_message,
            'status': 'success',
            'type': 'ai',
            'timestamp': datetime.now().isoformat()
        })

    except requests.exceptions.Timeout:
        return jsonify({
            'response': 'The request timed out. Please try again.',
            'status': 'error',
            'error': 'timeout'
        }), 504
    except requests.exceptions.RequestException as e:
        print(f"API Error: {str(e)}")
        return jsonify({
            'response': 'I apologize, but I encountered an error connecting to the AI service.',
            'status': 'error',
            'error': str(e)
        }), 502
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'response': 'I apologize, but I encountered an error. Please try again.',
            'status': 'error',
            'error': str(e)
        }), 500


@chat_bp.route('/simple-chat', methods=['POST'])
@limiter.limit("60 per minute")
def simple_chat():
    try:
        data = request.json
        user_message = data.get('message', '')

        if not user_message:
            return jsonify({
                'response': 'Please provide a message.',
                'status': 'error'
            }), 400

        simple_response = get_simple_response(user_message)

        if simple_response:
            from datetime import datetime
            return jsonify({
                'response': simple_response,
                'status': 'success',
                'type': 'simple',
                'timestamp': datetime.now().isoformat()
            })
        else:
            return jsonify({
                'response': None,
                'status': 'no_match',
                'message': 'No simple response available. Use /api/chat for AI responses.'
            }), 200

    except Exception as e:
        print(f"Error in simple-chat endpoint: {str(e)}")
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500
