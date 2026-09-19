from typing import Annotated

from fastapi import APIRouter, Depends
from supabase import Client

from app.core.dependencies import AdminUser, CurrentUser, get_supabase_client
from app.repositories.user_repository import UserRepository
from app.schemas.user import ProfileResponse, ProfileUpdate, RoleAssignRequest, UserResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


def get_user_service(
    client: Annotated[Client, Depends(get_supabase_client)],
) -> UserService:
    """Dependency injection for the user service."""
    repo = UserRepository(client)
    return UserService(repo)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user",
)
async def get_me(current_user: CurrentUser) -> UserResponse:
    """
    Return the authenticated user's profile from the JWT payload.

    This endpoint is intentionally simple in Phase 0.
    Phase 1 will augment it with data from the `profiles` table.
    """
    return current_user


@router.get(
    "/me/profile",
    response_model=ProfileResponse,
    summary="Get current user profile",
)
async def get_my_profile(
    current_user: CurrentUser,
    service: UserService = Depends(get_user_service),
) -> ProfileResponse:
    """Return the profile for the authenticated user."""
    profile = await service.get_profile(current_user)
    if not profile:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.patch(
    "/me/profile",
    response_model=ProfileResponse,
    summary="Update current user profile",
)
async def update_my_profile(
    data: ProfileUpdate,
    current_user: CurrentUser,
    service: UserService = Depends(get_user_service),
) -> ProfileResponse:
    """Update the authenticated user's profile information."""
    return await service.update_profile(current_user.id, data)


@router.get(
    "",
    response_model=list[UserResponse],
    summary="List all users",
)
async def list_users(
    _current_user: AdminUser,
    service: UserService = Depends(get_user_service),
) -> list[UserResponse]:
    """List all users (Admin or Super Admin only)."""
    return await service.list_users()


@router.patch(
    "/{user_id}/role",
    response_model=UserResponse,
    summary="Update user role",
)
async def update_user_role(
    user_id: str,
    request: RoleAssignRequest,
    current_user: AdminUser,
    service: UserService = Depends(get_user_service),
) -> UserResponse:
    """
    Update a user's role (Admin or Super Admin only).
    Note: Standard Admins cannot promote users to Super Admin,
    nor can they modify existing Super Admin accounts.
    """
    return await service.update_user_role(user_id, request, current_user)


@router.patch(
    "/{user_id}/profile",
    response_model=ProfileResponse,
    summary="Update user profile",
)
async def update_profile(
    user_id: str,
    data: ProfileUpdate,
    _current_user: AdminUser,
    service: UserService = Depends(get_user_service),
) -> ProfileResponse:
    """Update a user's profile information (Admin or Super Admin only)."""
    return await service.update_profile(user_id, data)
