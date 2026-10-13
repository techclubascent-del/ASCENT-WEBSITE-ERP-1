"""Post repository."""

from supabase import Client

from app.schemas.post import PostCreate, PostResponse, PostUpdate


class PostRepository:
    def __init__(self, client: Client) -> None:
        self._client = client

    async def create_post(self, author_id: str, data: PostCreate) -> PostResponse:
        payload = data.model_dump(mode="json")
        payload["author_id"] = author_id
        res = self._client.table("posts").insert(payload).execute()
        return PostResponse(**res.data[0])

    async def list_posts(self) -> list[PostResponse]:
        res = self._client.table("posts").select("*").order("created_at", desc=True).execute()
        return [PostResponse(**c) for c in res.data]

    async def list_user_posts(self, user_id: str) -> list[PostResponse]:
        res = self._client.table("posts").select("*").eq("author_id", user_id).order("created_at", desc=True).execute()
        return [PostResponse(**c) for c in res.data]

    async def update_post(
        self, post_id: str, data: PostUpdate
    ) -> PostResponse:
        payload = data.model_dump(exclude_unset=True, mode="json")
        res = (
            self._client.table("posts")
            .update(payload)
            .eq("id", post_id)
            .execute()
        )
        if not res.data:
            from app.core.exceptions import NotFoundError
            raise NotFoundError(detail="Post not found")
        return PostResponse(**res.data[0])

    async def delete_post(self, post_id: str) -> None:
        self._client.table("posts").delete().eq("id", post_id).execute()
