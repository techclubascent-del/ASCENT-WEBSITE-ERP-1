"""
Tests for RBAC dependencies and security guards.
All Supabase calls are mocked — no real network connection required.
"""

from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

VALID_MEMBER_PAYLOAD = {
    "sub": "user-member-id",
    "email": "member@ascent.com",
    "user_metadata": {"role": "member"},
}
VALID_ADMIN_PAYLOAD = {
    "sub": "user-admin-id",
    "email": "admin@ascent.com",
    "user_metadata": {"role": "admin"},
}
VALID_SUPER_ADMIN_PAYLOAD = {
    "sub": "user-super-id",
    "email": "super@ascent.com",
    "user_metadata": {"role": "super_admin"},
}


# Correct patch target — create_client is imported lazily inside get_supabase_client
PATCH_CREATE_CLIENT = "app.core.dependencies.create_client"


def patch_jwt(payload: dict):
    """Context manager that patches jwt.decode to return the given payload."""
    return patch("app.core.dependencies.jwt.decode", return_value=payload)


# ---------------------------------------------------------------------------
# /me endpoint
# ---------------------------------------------------------------------------


class TestGetMe:
    def test_unauthenticated_returns_401(self) -> None:
        response = client.get("/api/v1/users/me")
        assert response.status_code == 401

    def test_member_can_get_own_profile(self) -> None:
        with patch_jwt(VALID_MEMBER_PAYLOAD):
            response = client.get(
                "/api/v1/users/me",
                headers={"Authorization": "Bearer fake.jwt.token"},
            )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "user-member-id"
        assert data["email"] == "member@ascent.com"
        assert data["role"] == "member"

    def test_admin_can_get_own_profile(self) -> None:
        with patch_jwt(VALID_ADMIN_PAYLOAD):
            response = client.get(
                "/api/v1/users/me",
                headers={"Authorization": "Bearer fake.jwt.token"},
            )
        assert response.status_code == 200
        assert response.json()["role"] == "admin"


# ---------------------------------------------------------------------------
# RBAC Guards — AdminUser / SuperAdminUser
# ---------------------------------------------------------------------------


class TestRBACGuards:
    def test_member_blocked_from_list_users(self) -> None:
        """Members cannot access the admin user list."""
        with patch_jwt(VALID_MEMBER_PAYLOAD):
            response = client.get(
                "/api/v1/users",
                headers={"Authorization": "Bearer fake.jwt.token"},
            )
        assert response.status_code == 403

    def test_unauthenticated_blocked_from_list_users(self) -> None:
        response = client.get("/api/v1/users")
        assert response.status_code == 401

    def test_member_blocked_from_creating_opportunity(self) -> None:
        """Members cannot create opportunities."""
        with patch_jwt(VALID_MEMBER_PAYLOAD):
            response = client.post(
                "/api/v1/opportunities",
                json={
                    "title": "Test",
                    "description": "Test",
                    "status": "draft",
                },
                headers={"Authorization": "Bearer fake.jwt.token"},
            )
        assert response.status_code == 403

    def test_member_blocked_from_creating_event(self) -> None:
        """Members cannot create events."""
        with patch_jwt(VALID_MEMBER_PAYLOAD):
            response = client.post(
                "/api/v1/events",
                json={
                    "title": "Test Event",
                    "description": "Test",
                    "event_date": "2027-01-01T10:00:00Z",
                },
                headers={"Authorization": "Bearer fake.jwt.token"},
            )
        assert response.status_code == 403

    def test_member_blocked_from_updating_application_status(self) -> None:
        """Members cannot update application statuses."""
        with patch_jwt(VALID_MEMBER_PAYLOAD):
            response = client.patch(
                "/api/v1/applications/some-id",
                json={"status": "accepted"},
                headers={"Authorization": "Bearer fake.jwt.token"},
            )
        assert response.status_code == 403

    def test_member_blocked_from_admin_opportunities_list(self) -> None:
        """Members cannot access the admin opportunity list (includes drafts)."""
        with patch_jwt(VALID_MEMBER_PAYLOAD):
            response = client.get(
                "/api/v1/opportunities/admin/all",
                headers={"Authorization": "Bearer fake.jwt.token"},
            )
        assert response.status_code == 403

    def test_admin_can_access_admin_opportunities_list(self) -> None:
        """Admins can access the full opportunity list."""
        mock_client = MagicMock()
        (
            mock_client.table.return_value
            .select.return_value
            .execute.return_value.data
        ) = []

        with patch_jwt(VALID_ADMIN_PAYLOAD), patch(
            PATCH_CREATE_CLIENT, return_value=mock_client
        ):
            response = client.get(
                "/api/v1/opportunities/admin/all",
                headers={"Authorization": "Bearer fake.jwt.token"},
            )
        assert response.status_code == 200

    def test_member_blocked_from_certificate_create(self) -> None:
        """Members cannot issue certificates."""
        with patch_jwt(VALID_MEMBER_PAYLOAD):
            response = client.post(
                "/api/v1/certificates",
                json={
                    "user_id": "some-user",
                    "title": "Test Cert",
                    "issued_at": "2027-01-01T00:00:00Z",
                },
                headers={"Authorization": "Bearer fake.jwt.token"},
            )
        assert response.status_code == 403

    def test_member_blocked_from_recording_attendance(self) -> None:
        """Members cannot record attendance for others."""
        with patch_jwt(VALID_MEMBER_PAYLOAD):
            response = client.post(
                "/api/v1/attendance",
                json={
                    "user_id": "some-user",
                    "event_id": "some-event",
                    "status": "present",
                },
                headers={"Authorization": "Bearer fake.jwt.token"},
            )
        assert response.status_code == 403


# ---------------------------------------------------------------------------
# Public endpoints (no auth required)
# ---------------------------------------------------------------------------


class TestPublicEndpoints:
    def test_list_published_opportunities_no_auth(self) -> None:
        """Public opportunities list requires no authentication."""
        mock_client = MagicMock()
        (
            mock_client.table.return_value
            .select.return_value
            .eq.return_value
            .execute.return_value.data
        ) = []

        with patch(PATCH_CREATE_CLIENT, return_value=mock_client):
            response = client.get("/api/v1/opportunities")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_events_no_auth(self) -> None:
        """Public events list requires no authentication."""
        mock_client = MagicMock()
        (
            mock_client.table.return_value
            .select.return_value
            .execute.return_value.data
        ) = []

        with patch(PATCH_CREATE_CLIENT, return_value=mock_client):
            response = client.get("/api/v1/events")
        assert response.status_code == 200

    def test_health_endpoint(self) -> None:
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


# ---------------------------------------------------------------------------
# Application ownership
# ---------------------------------------------------------------------------


class TestApplicationOwnership:
    def _mock_app(self, owner_id: str) -> MagicMock:
        """Build a mock Supabase response returning an application owned by owner_id."""
        return MagicMock(
            data={
                "id": "app-123",
                "opportunity_id": "opp-456",
                "user_id": owner_id,
                "status": "submitted",
                "answers": {},
                "submitted_at": None,
                "created_at": "2027-01-01T00:00:00Z",
            }
        )

    def _mock_supabase(self, owner_id: str) -> MagicMock:
        """Return a fully-configured mock Supabase client."""
        mock_client = MagicMock()
        (
            mock_client.table.return_value
            .select.return_value
            .eq.return_value
            .maybe_single.return_value
            .execute.return_value
        ) = self._mock_app(owner_id)
        return mock_client

    def test_member_can_view_own_application(self) -> None:
        mock_client = self._mock_supabase("user-member-id")

        with patch_jwt(VALID_MEMBER_PAYLOAD), patch(
            PATCH_CREATE_CLIENT, return_value=mock_client
        ):
            response = client.get(
                "/api/v1/applications/app-123",
                headers={"Authorization": "Bearer fake.jwt.token"},
            )
        assert response.status_code == 200

    def test_member_cannot_view_other_users_application(self) -> None:
        mock_client = self._mock_supabase("some-other-user-id")

        with patch_jwt(VALID_MEMBER_PAYLOAD), patch(
            PATCH_CREATE_CLIENT, return_value=mock_client
        ):
            response = client.get(
                "/api/v1/applications/app-123",
                headers={"Authorization": "Bearer fake.jwt.token"},
            )
        assert response.status_code == 403

    def test_admin_can_view_any_application(self) -> None:
        mock_client = self._mock_supabase("some-other-user-id")

        with patch_jwt(VALID_ADMIN_PAYLOAD), patch(
            PATCH_CREATE_CLIENT, return_value=mock_client
        ):
            response = client.get(
                "/api/v1/applications/app-123",
                headers={"Authorization": "Bearer fake.jwt.token"},
            )
        assert response.status_code == 200


# ---------------------------------------------------------------------------
# Error handling
# ---------------------------------------------------------------------------


class TestErrorHandling:
    def test_invalid_jwt_returns_401(self) -> None:
        response = client.get(
            "/api/v1/users/me",
            headers={"Authorization": "Bearer definitely.not.valid"},
        )
        assert response.status_code == 401

    def test_malformed_auth_header_returns_401(self) -> None:
        # HTTPBearer with auto_error=False returns None creds → our code raises 401
        response = client.get(
            "/api/v1/users/me",
            headers={"Authorization": "NotBearer token"},
        )
        assert response.status_code == 401

    def test_404_returns_json(self) -> None:
        mock_client = MagicMock()
        (
            mock_client.table.return_value
            .select.return_value
            .eq.return_value
            .maybe_single.return_value
            .execute.return_value.data
        ) = None

        with patch_jwt(VALID_MEMBER_PAYLOAD), patch(
            PATCH_CREATE_CLIENT, return_value=mock_client
        ):
            response = client.get(
                "/api/v1/applications/nonexistent-id",
                headers={"Authorization": "Bearer fake.jwt.token"},
            )
        assert response.status_code == 404
        body = response.json()
        assert "detail" in body
        assert body.get("code") == "NOT_FOUND"
