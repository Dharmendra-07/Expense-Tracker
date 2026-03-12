from ..database import db
from ..models.category import Category


class CategoryNotFound(Exception):
    pass


class CategoryService:
    @staticmethod
    def get_all():
        return Category.query.order_by(Category.name).all()

    @staticmethod
    def get_by_id(category_id: int) -> Category:
        category = Category.query.get(category_id)
        if category is None:
            raise CategoryNotFound(f"Category {category_id} not found.")
        return category

    @staticmethod
    def create(name: str, color: str = "#6b7280") -> Category:
        category = Category(name=name, color=color)
        db.session.add(category)
        db.session.commit()
        return category
