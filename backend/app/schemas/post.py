from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PostBase(BaseModel):
    content: str = Field(..., min_length=1)
    image_url: str | None = None
    video_url: str | None = None
    github_url: str | None = None
    demo_url: str | None = None
    tech_stack: list[str] | None = Field(default_factory=list)


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    content: str | None = None
    image_url: str | None = None
    video_url: str | None = None
    github_url: str | None = None
    demo_url: str | None = None
    tech_stack: list[str] | None = None
    is_archived: bool | None = None


class PostResponse(PostBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    author_id: str
    is_archived: bool
    created_at: datetime
    updated_at: datetime
