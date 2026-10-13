"""Messages routes."""

from typing import Annotated

from fastapi import APIRouter, Depends
from supabase import Client

from app.core.dependencies import CurrentUser, get_supabase_client
from app.repositories.message_repository import MessageRepository
from app.schemas.message import MessageCreate, MessageResponse, MessageUpdate
from app.services.message_service import MessageService

router = APIRouter(prefix="/messages", tags=["messages"])


def get_message_service(
    client: Annotated[Client, Depends(get_supabase_client)],
) -> MessageService:
    repo = MessageRepository(client)
    return MessageService(repo)


@router.get("/recent", response_model=list[MessageResponse])
async def list_recent_chats(
    current_user: CurrentUser,
    service: Annotated[MessageService, Depends(get_message_service)],
) -> list[MessageResponse]:
    """List recent messages for the current user."""
    return await service.list_recent_chats(current_user.id)


@router.get("/conversation/{other_user_id}", response_model=list[MessageResponse])
async def list_conversation(
    other_user_id: str,
    current_user: CurrentUser,
    service: Annotated[MessageService, Depends(get_message_service)],
) -> list[MessageResponse]:
    """List full conversation between current user and another user."""
    return await service.list_conversation(current_user.id, other_user_id)


@router.post("", response_model=MessageResponse)
async def create_message(
    data: MessageCreate,
    current_user: CurrentUser,
    service: Annotated[MessageService, Depends(get_message_service)],
) -> MessageResponse:
    """Send a new message."""
    return await service.create_message(current_user.id, data)


@router.patch("/{message_id}", response_model=MessageResponse)
async def update_message(
    message_id: str,
    data: MessageUpdate,
    _current_user: CurrentUser,
    service: Annotated[MessageService, Depends(get_message_service)],
) -> MessageResponse:
    """Update a message (e.g. read_at status)."""
    return await service.update_message(message_id, data)
