import dotenv
from flask import Flask
from .extensions import limiter
from flask_cors import CORS

dotenv.load_dotenv()


def create_app():
    app = Flask(__name__)
    CORS(app)

    limiter.init_app(app)
    from .controllers.chat_controller import chat_bp
    from .controllers.analyze_controller import analyze_bp
    from .controllers.health_controller import health_bp

    app.register_blueprint(chat_bp, url_prefix='/api')
    app.register_blueprint(analyze_bp, url_prefix='/api')
    app.register_blueprint(health_bp, url_prefix='/api')

    from .errors import register_error_handlers
    register_error_handlers(app)

    return app
