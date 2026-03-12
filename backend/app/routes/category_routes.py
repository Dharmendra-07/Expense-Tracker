from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from ..schemas import category_schema, categories_schema
from ..services.category_service import CategoryService, CategoryNotFound

category_bp = Blueprint("categories", __name__)


def _error(message, status=400):
    return jsonify({"error": message}), status


@category_bp.route("", methods=["GET"])
def list_categories():
    categories = CategoryService.get_all()
    return jsonify(categories_schema.dump(categories)), 200


@category_bp.route("", methods=["POST"])
def create_category():
    try:
        data = category_schema.load(request.get_json() or {})
    except ValidationError as e:
        return _error(e.messages, 422)

    category = CategoryService.create(**data)
    return jsonify(category_schema.dump(category)), 201
