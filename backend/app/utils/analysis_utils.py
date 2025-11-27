def analyze_sentiment_trend(message_sentiments):
    if len(message_sentiments) < 2:
        return "Not enough messages to determine a trend."
    sentiment_map = {'Positive': 1, 'Neutral': 0, 'Negative': -1}
    sentiments = [sentiment_map.get(msg['sentiment'], 0) for msg in message_sentiments]
    first_half = sentiments[:len(sentiments)//2]
    second_half = sentiments[len(sentiments)//2:]

    first_half_avg = sum(first_half) / len(first_half) if first_half else 0
    second_half_avg = sum(second_half) / len(second_half) if second_half else 0

    if second_half_avg > first_half_avg + 0.3:
        return "The conversation showed a positive trend, with sentiment improving over time."
    elif second_half_avg < first_half_avg - 0.3:
        return "The conversation showed a negative trend, with sentiment declining over time."
    elif abs(second_half_avg - first_half_avg) < 0.3:
        overall_avg = sum(sentiments) / len(sentiments)
        if overall_avg > 0.3:
            return "The conversation maintained a consistently positive sentiment throughout."
        elif overall_avg < -0.3:
            return "The conversation maintained a consistently negative sentiment throughout."
        else:
            return "The conversation showed mixed sentiments with no clear trend."
    else:
        return "The sentiment fluctuated throughout the conversation."
