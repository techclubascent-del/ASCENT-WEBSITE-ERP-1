"""
User service — business logic layer for the users/profiles domain.

Rules:
- Contains business decisions and workflow orchestration.
- Calls repositories for data access.
- Does NOT import from FastAPI or handle HTTP directly.
"""

from app.core.exceptions import ForbiddenError
from app.repositories.user_repository import UserRepository
from app.schemas.user import (
    ProfileResponse,
    ProfileUpdate,
    RoleAssignRequest,
    UserResponse,
    UserRole,
)


class UserService:
    """Business operations for the user domain."""

    def __init__(self, repository: UserRepository) -> None:
        self._repository = repository

    async def get_profile(self, user: UserResponse) -> ProfileResponse | None:
        """
        Return the profile for the given user.
        Provides a fallback profile with user details if no database record exists yet.
        """
        profile = await self._repository.get_profile_by_user_id(user.id)
        if not profile:
            name_part = user.email.split("@")[0].replace(".", " ").title()
            return ProfileResponse(
                id=user.id,
                user_id=user.id,
                full_name=name_part or "ASCENT Admin",
                bio="Platform Administrator",
                avatar_url=None,
            )
        return profile

    async def list_users(self) -> list[UserResponse]:
        """List all users."""
        return await self._repository.list_users()

    async def update_user_role(
        self, target_user_id: str, request: RoleAssignRequest, current_user: UserResponse
    ) -> UserResponse:
        """
        Update a user's role with strict RBAC enforcement.
        - Admins cannot create or demote Super Admins.
        - Only Super Admins can manage Super Admin roles.
        """
        # Admins cannot promote anyone to SUPER_ADMIN
        if request.role == UserRole.SUPER_ADMIN and current_user.role != UserRole.SUPER_ADMIN:
            raise ForbiddenError(detail="Only Super Admins can assign the super_admin role.")
            
        # We need to know the target user's current role.
        # But we don't have a get_user_by_id in the repository right now.
        # We can fetch all users and find them, or just add get_user_by_id.
        # To avoid overhead, let's fetch all users for now since this is an admin op.
        users = await self._repository.list_users()
        target_user = next((u for u in users if u.id == target_user_id), None)
        
        if not target_user:
            from app.core.exceptions import NotFoundError
            raise NotFoundError(detail="User not found.")
            
        # Admins cannot modify existing SUPER_ADMINs
        if target_user.role == UserRole.SUPER_ADMIN and current_user.role != UserRole.SUPER_ADMIN:
            raise ForbiddenError(detail="Admins cannot modify Super Admin accounts.")
            
        return await self._repository.update_user_role(target_user_id, request.role)

    async def update_profile(self, user_id: str, data: ProfileUpdate) -> ProfileResponse:
        """Update a user's profile."""
        return await self._repository.update_profile(user_id, data)
