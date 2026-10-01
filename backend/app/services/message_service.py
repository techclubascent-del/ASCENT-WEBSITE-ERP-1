"""Message service."""

from app.repositories.message_repository import MessageRepository
from app.schemas.message import MessageCreate, MessageResponse, MessageUpdate


class MessageService:
    def __init__(self, repository: MessageRepository) -> None:
        self._repository = repository

    async def create_message(self, sender_id: str, data: MessageCreate) -> MessageResponse:
        return await self._repository.create_message(sender_id, data)

    async def list_conversation(self, user_id: str, other_user_id: str) -> list[MessageResponse]:
        return await self._repository.list_conversation(user_id, other_user_id)

    async def list_recent_chats(self, user_id: str) -> list[MessageResponse]:
        return await self._repository.list_recent_chats(user_id)

    async def update_message(self, message_id: str, data: MessageUpdate) -> MessageResponse:
        return await self._repository.update_message(message_id, data)
