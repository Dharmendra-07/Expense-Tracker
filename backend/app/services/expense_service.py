from decimal import Decimal
from datetime import date
from ..database import db
from ..models.expense import Expense
from ..models.category import Category


class ExpenseNotFound(Exception):
    pass


class CategoryNotFound(Exception):
    pass


class ExpenseService:
    @staticmethod
    def get_all(category_id=None, month=None, year=None):
        query = Expense.query.join(Category)

        if category_id is not None:
            query = query.filter(Expense.category_id == category_id)

        if year is not None:
            query = query.filter(db.extract("year", Expense.date) == year)

        if month is not None:
            query = query.filter(db.extract("month", Expense.date) == month)

        return query.order_by(Expense.date.desc()).all()

    @staticmethod
    def get_by_id(expense_id: int) -> Expense:
        expense = Expense.query.get(expense_id)
        if expense is None:
            raise ExpenseNotFound(f"Expense {expense_id} not found.")
        return expense

    @staticmethod
    def create(title: str, amount: Decimal, category_id: int, date: date, note: str = None) -> Expense:
        category = Category.query.get(category_id)
        if category is None:
            raise CategoryNotFound(f"Category {category_id} not found.")

        expense = Expense(
            title=title,
            amount=amount,
            category_id=category_id,
            date=date,
            note=note,
        )
        db.session.add(expense)
        db.session.commit()
        return expense

    @staticmethod
    def update(expense_id: int, **kwargs) -> Expense:
        expense = ExpenseService.get_by_id(expense_id)

        if "category_id" in kwargs:
            category = Category.query.get(kwargs["category_id"])
            if category is None:
                raise CategoryNotFound(f"Category {kwargs['category_id']} not found.")

        for field, value in kwargs.items():
            if hasattr(expense, field):
                setattr(expense, field, value)

        db.session.commit()
        return expense

    @staticmethod
    def delete(expense_id: int) -> None:
        expense = ExpenseService.get_by_id(expense_id)
        db.session.delete(expense)
        db.session.commit()

    @staticmethod
    def get_summary(year: int, month: int) -> dict:
        expenses = ExpenseService.get_all(month=month, year=year)
        total = sum(float(e.amount) for e in expenses)

        by_category = {}
        for e in expenses:
            cat = e.category.name
            by_category[cat] = by_category.get(cat, {"total": 0, "color": e.category.color, "count": 0})
            by_category[cat]["total"] += float(e.amount)
            by_category[cat]["count"] += 1

        return {
            "total": total,
            "count": len(expenses),
            "by_category": by_category,
            "month": month,
            "year": year,
        }
