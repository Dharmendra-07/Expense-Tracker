import json
from datetime import date


def get_category_id(client):
    res = client.get("/api/categories")
    categories = json.loads(res.data)
    return categories[0]["id"]


class TestCreateExpense:
    def test_create_valid_expense(self, client):
        cat_id = get_category_id(client)
        payload = {"title": "Coffee", "amount": "4.50", "category_id": cat_id, "date": str(date.today())}
        res = client.post("/api/expenses", json=payload)
        assert res.status_code == 201
        data = json.loads(res.data)
        assert data["title"] == "Coffee"
        assert data["amount"] == "4.50"

    def test_create_rejects_zero_amount(self, client):
        cat_id = get_category_id(client)
        res = client.post("/api/expenses", json={"title": "Free", "amount": 0, "category_id": cat_id})
        assert res.status_code == 422

    def test_create_rejects_negative_amount(self, client):
        cat_id = get_category_id(client)
        res = client.post("/api/expenses", json={"title": "Negative", "amount": -10, "category_id": cat_id})
        assert res.status_code == 422

    def test_create_rejects_missing_title(self, client):
        cat_id = get_category_id(client)
        res = client.post("/api/expenses", json={"amount": 10.0, "category_id": cat_id})
        assert res.status_code == 422

    def test_create_rejects_invalid_category(self, client):
        res = client.post("/api/expenses", json={"title": "Test", "amount": 10.0, "category_id": 9999})
        assert res.status_code == 404

    def test_create_with_note(self, client):
        cat_id = get_category_id(client)
        res = client.post(
            "/api/expenses",
            json={"title": "Lunch", "amount": 12.0, "category_id": cat_id, "note": "With colleagues"},
        )
        assert res.status_code == 201
        assert json.loads(res.data)["note"] == "With colleagues"


class TestGetExpense:
    def test_get_all_expenses(self, client):
        res = client.get("/api/expenses")
        assert res.status_code == 200
        assert isinstance(json.loads(res.data), list)

    def test_get_nonexistent_expense(self, client):
        res = client.get("/api/expenses/9999")
        assert res.status_code == 404

    def test_get_existing_expense(self, client):
        cat_id = get_category_id(client)
        create_res = client.post("/api/expenses", json={"title": "Bus", "amount": 2.0, "category_id": cat_id})
        expense_id = json.loads(create_res.data)["id"]
        res = client.get(f"/api/expenses/{expense_id}")
        assert res.status_code == 200
        assert json.loads(res.data)["title"] == "Bus"


class TestUpdateExpense:
    def test_update_expense(self, client):
        cat_id = get_category_id(client)
        create_res = client.post("/api/expenses", json={"title": "Old", "amount": 5.0, "category_id": cat_id})
        expense_id = json.loads(create_res.data)["id"]
        res = client.put(f"/api/expenses/{expense_id}", json={"title": "New", "amount": 7.0, "category_id": cat_id})
        assert res.status_code == 200
        assert json.loads(res.data)["title"] == "New"

    def test_update_nonexistent_expense(self, client):
        cat_id = get_category_id(client)
        res = client.put("/api/expenses/9999", json={"title": "X", "amount": 1.0, "category_id": cat_id})
        assert res.status_code == 404


class TestDeleteExpense:
    def test_delete_expense(self, client):
        cat_id = get_category_id(client)
        create_res = client.post("/api/expenses", json={"title": "Temp", "amount": 3.0, "category_id": cat_id})
        expense_id = json.loads(create_res.data)["id"]
        res = client.delete(f"/api/expenses/{expense_id}")
        assert res.status_code == 200
        assert client.get(f"/api/expenses/{expense_id}").status_code == 404

    def test_delete_nonexistent_expense(self, client):
        res = client.delete("/api/expenses/9999")
        assert res.status_code == 404


class TestSummary:
    def test_summary_returns_correct_shape(self, client):
        res = client.get("/api/expenses/summary")
        assert res.status_code == 200
        data = json.loads(res.data)
        assert "total" in data
        assert "by_category" in data
        assert "count" in data
