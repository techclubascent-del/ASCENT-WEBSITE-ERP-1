"""Event schemas."""

from datetime import datetime

from pydantic import BaseModel


class EventBase(BaseModel):
    """Base fields for an event."""

    title: str
    description: str
    event_date: datetime
    location: str | None = None


class EventCreate(EventBase):
    """Data required to create a new event."""

    pass


class EventUpdate(BaseModel):
    """Optional fields to update an existing event."""

    title: str | None = None
    description: str | None = None
    event_date: datetime | None = None
    location: str | None = None


class EventResponse(EventBase):
    """Data returned to the client."""

    id: str
    created_by: str
    created_at: datetime
