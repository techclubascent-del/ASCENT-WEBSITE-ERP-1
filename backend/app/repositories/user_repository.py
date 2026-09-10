"""
User repository — data access layer for the users/profiles domain.

Rules:
- Only this layer talks to the database.
- No HTTP, no FastAPI, no business logic here.
- Returns domain data or raises repository-level exceptions.
"""
from supabase import Client

from app.schemas.user import ProfileResponse


class UserRepository:
    """Handles database operations for the user/profile domain."""

    def __init__(self, client: Client) -> None:
        self._client = client

    async def get_profile_by_user_id(self, user_id: str) -> ProfileResponse | None:
        """
        Fetch a user's profile by their Supabase user ID.
        Returns None if no profile exists yet.

        Phase 0: Stub — implement fully in Phase 1 when the profiles table exists.
        """
        response = (
            self._client.table("profiles")
            .select("*")
            .eq("user_id", user_id)
            .maybe_single()
            .execute()
        )
        if response.data is None:
            return None
        return ProfileResponse(**response.data)
