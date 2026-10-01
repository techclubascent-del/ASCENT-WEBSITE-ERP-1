"""Post service."""

from app.repositories.post_repository import PostRepository
from app.schemas.post import PostCreate, PostResponse, PostUpdate


class PostService:
    def __init__(self, repository: PostRepository) -> None:
        self._repository = repository

    async def create_post(self, author_id: str, data: PostCreate) -> PostResponse:
        return await self._repository.create_post(author_id, data)

    async def list_posts(self) -> list[PostResponse]:
        return await self._repository.list_posts()

    async def list_user_posts(self, user_id: str) -> list[PostResponse]:
        return await self._repository.list_user_posts(user_id)

    async def update_post(self, post_id: str, data: PostUpdate) -> PostResponse:
        return await self._repository.update_post(post_id, data)

    async def delete_post(self, post_id: str) -> None:
        await self._repository.delete_post(post_id)
