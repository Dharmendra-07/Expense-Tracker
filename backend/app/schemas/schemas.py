from marshmallow import Schema, fields, validate, validates, ValidationError
from datetime import date


class CategorySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    color = fields.Str(load_default="#6b7280", validate=validate.Regexp(r"^#[0-9a-fA-F]{6}$"))


class ExpenseCreateSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    amount = fields.Decimal(required=True, places=2)
    date = fields.Date(load_default=date.today)
    note = fields.Str(load_default=None, allow_none=True, validate=validate.Length(max=1000))
    category_id = fields.Int(required=True)

    @validates("amount")
    def validate_amount(self, value):
        if value <= 0:
            raise ValidationError("Amount must be greater than zero.")
        if value > 9_999_999.99:
            raise ValidationError("Amount exceeds maximum allowed value.")


class ExpenseResponseSchema(Schema):
    id = fields.Int()
    title = fields.Str()
    amount = fields.Decimal(as_string=True)
    date = fields.Date()
    note = fields.Str(allow_none=True)
    category_id = fields.Int()
    category = fields.Nested(CategorySchema)


expense_create_schema = ExpenseCreateSchema()
expense_response_schema = ExpenseResponseSchema()
expenses_response_schema = ExpenseResponseSchema(many=True)
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)
