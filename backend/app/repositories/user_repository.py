"""
User repository — data access layer for the users/profiles domain.

Rules:
- Only this layer talks to the database.
- No HTTP, no FastAPI, no business logic here.
- Returns domain data or raises repository-level exceptions.
"""

from supabase import Client

from app.schemas.user import ProfileResponse, ProfileUpdate, UserResponse, UserRole


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

    async def list_users(self) -> list[UserResponse]:
        """List all users (Admin operation)."""
        res = self._client.auth.admin.list_users()
        
        # Depending on gotrue-py version, res is either a list of users or an object with .users
        user_list = res.users if hasattr(res, "users") else res
        
        users = []
        for u in user_list:
            meta = getattr(u, "user_metadata", {}) or getattr(u, "raw_user_meta_data", {}) or {}
            role_str = meta.get("role", UserRole.MEMBER)
            try:
                role = UserRole(role_str)
            except ValueError:
                role = UserRole.MEMBER
                
            users.append(UserResponse(id=u.id, email=u.email, role=role))
        return users

    async def update_user_role(self, user_id: str, role: UserRole) -> UserResponse:
        """Update a user's role (Admin operation)."""
        res = self._client.auth.admin.update_user_by_id(
            user_id,
            {"user_metadata": {"role": role.value}}
        )
        
        u = res.user if hasattr(res, "user") else res
        
        return UserResponse(id=u.id, email=u.email, role=role)

    async def update_profile(self, user_id: str, data: ProfileUpdate) -> ProfileResponse:
        """Update user profile."""
        payload = data.model_dump(exclude_unset=True, mode="json")
        res = (
            self._client.table("profiles")
            .update(payload)
            .eq("user_id", user_id)
            .execute()
        )
        if not res.data:
            from app.core.exceptions import NotFoundError
            raise NotFoundError(detail="Profile not found")
        return ProfileResponse(**res.data[0])
