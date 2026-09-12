"""
Health check endpoint tests.

These tests verify that the service starts correctly and the health endpoint
responds as expected. No database connection is required.
"""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_returns_ok() -> None:
    """GET /api/v1/health should return 200 with status 'ok'."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_health_content_type_is_json() -> None:
    """Health endpoint should return JSON content."""
    response = client.get("/api/v1/health")
    assert "application/json" in response.headers["content-type"]
