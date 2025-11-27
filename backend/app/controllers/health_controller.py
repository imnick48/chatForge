from flask import Blueprint, jsonify
from datetime import datetime

health_bp = Blueprint('health', __name__)


@health_bp.route('/rate-limit-status', methods=['GET'])
def rate_limit_status():
    try:
        return jsonify({
            'status': 'success',
            'message': 'Rate limits are active',
            'limits': {
                'chat': '30 per minute',
                'simple_chat': '60 per minute',
                'analyze': '20 per minute',
                'global': '200 per day, 50 per hour'
            }
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500


@health_bp.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })
