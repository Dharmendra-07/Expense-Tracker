from flask import Flask
from flask_cors import CORS
from .database import db
from .routes.expense_routes import expense_bp
from .routes.category_routes import category_bp


def create_app(config=None):
    app = Flask(__name__)

    # Default config
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///expenses.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    if config:
        app.config.update(config)

    CORS(app)
    db.init_app(app)

    app.register_blueprint(expense_bp, url_prefix="/api/expenses")
    app.register_blueprint(category_bp, url_prefix="/api/categories")

    with app.app_context():
        db.create_all()
        _seed_default_categories()

    return app


def _seed_default_categories():
    from .models.category import Category

    if Category.query.count() == 0:
        defaults = [
            ("Food & Dining", "#ef4444"),
            ("Transport", "#f97316"),
            ("Housing", "#8b5cf6"),
            ("Healthcare", "#06b6d4"),
            ("Entertainment", "#ec4899"),
            ("Shopping", "#14b8a6"),
            ("Education", "#3b82f6"),
            ("Other", "#6b7280"),
        ]
        for name, color in defaults:
            db.session.add(Category(name=name, color=color))
        db.session.commit()
