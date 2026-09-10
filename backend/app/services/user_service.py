"""
User service — business logic layer for the users/profiles domain.

Rules:
- Contains business decisions and workflow orchestration.
- Calls repositories for data access.
- Does NOT import from FastAPI or handle HTTP directly.
"""
from app.repositories.user_repository import UserRepository
from app.schemas.user import ProfileResponse, UserResponse


class UserService:
    """Business operations for the user domain."""

    def __init__(self, repository: UserRepository) -> None:
        self._repository = repository

    async def get_profile(self, user: UserResponse) -> ProfileResponse | None:
        """
        Return the profile for the given user.
        Phase 0 stub — the profiles table doesn't exist yet.

        Phase 1 will expand this to create a default profile if none exists.
        """
        return await self._repository.get_profile_by_user_id(user.id)
