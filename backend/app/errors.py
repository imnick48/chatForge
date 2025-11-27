def register_error_handlers(app):
    @app.errorhandler(429)
    def ratelimit_handler(e):
        return app.response_class(
            response=app.json.dumps({
                'error': 'Rate limit exceeded',
                'message': str(e.description),
                'status': 'rate_limit_exceeded'
            }),
            status=429,
            mimetype='application/json'
        )
