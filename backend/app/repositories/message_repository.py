"""Message repository."""

from supabase import Client

from app.schemas.message import MessageCreate, MessageResponse, MessageUpdate


class MessageRepository:
    def __init__(self, client: Client) -> None:
        self._client = client

    async def create_message(self, sender_id: str, data: MessageCreate) -> MessageResponse:
        payload = data.model_dump(mode="json")
        payload["sender_id"] = sender_id
        res = self._client.table("messages").insert(payload).execute()
        return MessageResponse(**res.data[0])

    async def list_conversation(self, user_id: str, other_user_id: str) -> list[MessageResponse]:
        # get all messages where (sender_id = user_id AND receiver_id = other_user_id)
        # OR (sender_id = other_user_id AND receiver_id = user_id)
        res = self._client.table("messages").select("*").or_(
            f"and(sender_id.eq.{user_id},receiver_id.eq.{other_user_id}),and(sender_id.eq.{other_user_id},receiver_id.eq.{user_id})"
        ).order("created_at", desc=False).execute()
        return [MessageResponse(**m) for m in res.data]

    async def list_recent_chats(self, user_id: str) -> list[MessageResponse]:
        # Simple implementation for getting messages involving user
        res = self._client.table("messages").select("*").or_(
            f"sender_id.eq.{user_id},receiver_id.eq.{user_id}"
        ).order("created_at", desc=True).execute()
        return [MessageResponse(**m) for m in res.data]

    async def update_message(self, message_id: str, data: MessageUpdate) -> MessageResponse:
        payload = data.model_dump(exclude_unset=True, mode="json")
        res = (
            self._client.table("messages")
            .update(payload)
            .eq("id", message_id)
            .execute()
        )
        if not res.data:
            from app.core.exceptions import NotFoundError
            raise NotFoundError(detail="Message not found")
        return MessageResponse(**res.data[0])
