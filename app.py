from flask import Flask, render_template
from flask_login import LoginManager
from flask_migrate import Migrate
from config import Config
from models import db, User
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate = Migrate(app, db)
    
    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register Blueprints
    from routes.auth import auth_bp
    from routes.main import main_bp
    from routes.api_resume import resume_bp
    from routes.api_ai import ai_bp
    from routes.admin import admin_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(ai_bp)
    app.register_blueprint(admin_bp)

    with app.app_context():
        db.create_all() # Ensure DB is created for simplicity

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
