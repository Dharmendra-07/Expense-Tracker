from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from ..schemas import (
    expense_create_schema,
    expense_response_schema,
    expenses_response_schema,
)
from ..services.expense_service import ExpenseService, ExpenseNotFound, CategoryNotFound

expense_bp = Blueprint("expenses", __name__)


def _error(message, status=400):
    return jsonify({"error": message}), status


@expense_bp.route("", methods=["GET"])
def list_expenses():
    category_id = request.args.get("category_id", type=int)
    month = request.args.get("month", type=int)
    year = request.args.get("year", type=int)

    expenses = ExpenseService.get_all(category_id=category_id, month=month, year=year)
    return jsonify(expenses_response_schema.dump(expenses)), 200


@expense_bp.route("/summary", methods=["GET"])
def summary():
    from datetime import date
    today = date.today()
    month = request.args.get("month", type=int, default=today.month)
    year = request.args.get("year", type=int, default=today.year)
    data = ExpenseService.get_summary(year=year, month=month)
    return jsonify(data), 200


@expense_bp.route("/<int:expense_id>", methods=["GET"])
def get_expense(expense_id):
    try:
        expense = ExpenseService.get_by_id(expense_id)
        return jsonify(expense_response_schema.dump(expense)), 200
    except ExpenseNotFound as e:
        return _error(str(e), 404)


@expense_bp.route("", methods=["POST"])
def create_expense():
    try:
        data = expense_create_schema.load(request.get_json() or {})
    except ValidationError as e:
        return _error(e.messages, 422)

    try:
        expense = ExpenseService.create(**data)
        return jsonify(expense_response_schema.dump(expense)), 201
    except CategoryNotFound as e:
        return _error(str(e), 404)


@expense_bp.route("/<int:expense_id>", methods=["PUT"])
def update_expense(expense_id):
    try:
        data = expense_create_schema.load(request.get_json() or {})
    except ValidationError as e:
        return _error(e.messages, 422)

    try:
        expense = ExpenseService.update(expense_id, **data)
        return jsonify(expense_response_schema.dump(expense)), 200
    except ExpenseNotFound as e:
        return _error(str(e), 404)
    except CategoryNotFound as e:
        return _error(str(e), 404)


@expense_bp.route("/<int:expense_id>", methods=["DELETE"])
def delete_expense(expense_id):
    try:
        ExpenseService.delete(expense_id)
        return jsonify({"message": "Deleted successfully."}), 200
    except ExpenseNotFound as e:
        return _error(str(e), 404)
