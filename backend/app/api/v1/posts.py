"""Posts routes."""

from typing import Annotated

from fastapi import APIRouter, Depends
from supabase import Client

from app.core.dependencies import CurrentUser, get_supabase_client
from app.repositories.post_repository import PostRepository
from app.schemas.post import PostCreate, PostResponse, PostUpdate
from app.services.post_service import PostService

router = APIRouter(prefix="/posts", tags=["posts"])


def get_post_service(
    client: Annotated[Client, Depends(get_supabase_client)],
) -> PostService:
    repo = PostRepository(client)
    return PostService(repo)


@router.get("", response_model=list[PostResponse])
async def list_posts(
    _current_user: CurrentUser,
    service: Annotated[PostService, Depends(get_post_service)],
) -> list[PostResponse]:
    """List all posts."""
    return await service.list_posts()


@router.get("/user/{user_id}", response_model=list[PostResponse])
async def list_user_posts(
    user_id: str,
    _current_user: CurrentUser,
    service: Annotated[PostService, Depends(get_post_service)],
) -> list[PostResponse]:
    """List posts for a specific user."""
    return await service.list_user_posts(user_id)


@router.post("", response_model=PostResponse)
async def create_post(
    data: PostCreate,
    current_user: CurrentUser,
    service: Annotated[PostService, Depends(get_post_service)],
) -> PostResponse:
    """Create a new post."""
    return await service.create_post(current_user.id, data)


@router.patch("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: str,
    data: PostUpdate,
    _current_user: CurrentUser,
    service: Annotated[PostService, Depends(get_post_service)],
) -> PostResponse:
    """Update a post."""
    return await service.update_post(post_id, data)


@router.delete("/{post_id}", status_code=204)
async def delete_post(
    post_id: str,
    _current_user: CurrentUser,
    service: Annotated[PostService, Depends(get_post_service)],
) -> None:
    """Delete a post."""
    await service.delete_post(post_id)
