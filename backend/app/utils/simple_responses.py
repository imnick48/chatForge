SIMPLE_RESPONSES = {
    'hello': 'Hello! How can I assist you today?',
    'hi': 'Hi there! What can I help you with?',
    'hey': 'Hey! How can I help?',
    'how are you': "I'm doing well, thank you! How can I assist you?",
    'thanks': "You're welcome! Let me know if you need anything else.",
    'thank you': "You're very welcome! Happy to help!",
    'bye': 'Goodbye! Have a great day!',
    'goodbye': 'Take care! Feel free to come back anytime.',
}


def get_simple_response(message: str):
    message_lower = message.lower().strip()

    if message_lower in SIMPLE_RESPONSES:
        return SIMPLE_RESPONSES[message_lower]
    
    for key, response in SIMPLE_RESPONSES.items():
        if key in message_lower and len(message_lower) < 30:
            return response

    return None
