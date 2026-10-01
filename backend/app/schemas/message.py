from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MessageBase(BaseModel):
    receiver_id: str
    content: str = Field(..., min_length=1)


class MessageCreate(MessageBase):
    pass


class MessageUpdate(BaseModel):
    read_at: datetime | None = None


class MessageResponse(MessageBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    sender_id: str
    read_at: datetime | None = None
    created_at: datetime
