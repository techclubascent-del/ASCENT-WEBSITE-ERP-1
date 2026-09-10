from typing import Annotated

from fastapi import APIRouter, Depends
from supabase import Client

from app.core.dependencies import CurrentUser, get_supabase_client
from app.schemas.user import UserResponse, ProfileResponse
from app.repositories.user_repository import UserRepository
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
