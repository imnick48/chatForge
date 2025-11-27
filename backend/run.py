from app import create_app

app = create_app()

if __name__ == '__main__':
    import os
    if not os.getenv('OPENROUTER_API_KEY'):
        print("WARNING: OPENROUTER_API_KEY not found in environment variables")

    app.run(debug=True, port=5000)
