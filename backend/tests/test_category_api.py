import json


class TestCategories:
    def test_get_categories_returns_list(self, client):
        res = client.get("/api/categories")
        assert res.status_code == 200
        data = json.loads(res.data)
        assert isinstance(data, list)
        assert len(data) > 0  # seeded defaults exist

    def test_category_has_required_fields(self, client):
        res = client.get("/api/categories")
        cat = json.loads(res.data)[0]
        assert "id" in cat
        assert "name" in cat
        assert "color" in cat

    def test_create_category(self, client):
        res = client.post("/api/categories", json={"name": "Groceries", "color": "#22c55e"})
        assert res.status_code == 201
        data = json.loads(res.data)
        assert data["name"] == "Groceries"

    def test_create_category_invalid_color(self, client):
        res = client.post("/api/categories", json={"name": "Test", "color": "notacolor"})
        assert res.status_code == 422

    def test_create_category_missing_name(self, client):
        res = client.post("/api/categories", json={"color": "#ffffff"})
        assert res.status_code == 422
