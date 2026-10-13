"""Event routes."""

from typing import Annotated

from fastapi import APIRouter, Depends
from supabase import Client

from app.core.dependencies import AdminUser, get_supabase_client
from app.repositories.event_repository import EventRepository
from app.schemas.event import EventCreate, EventResponse, EventUpdate
from app.services.event_service import EventService

router = APIRouter(prefix="/events", tags=["events"])


def get_event_service(
    client: Annotated[Client, Depends(get_supabase_client)],
) -> EventService:
    """Dependency injection for the event service."""
    repo = EventRepository(client)
    return EventService(repo)


@router.get("", response_model=list[EventResponse])
async def list_events(
    service: Annotated[EventService, Depends(get_event_service)],
) -> list[EventResponse]:
    """List all events."""
    return await service.list_events()


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(
    event_id: str,
    service: Annotated[EventService, Depends(get_event_service)],
) -> EventResponse:
    """Get a specific event by ID."""
    return await service.get_event(event_id)


@router.post("", response_model=EventResponse)
async def create_event(
    data: EventCreate,
    current_user: AdminUser,
    service: Annotated[EventService, Depends(get_event_service)],
) -> EventResponse:
    """Create a new event (Admin or Super Admin only)."""
    return await service.create_event(data, current_user.id)


@router.patch("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: str,
    data: EventUpdate,
    _current_user: AdminUser,
    service: Annotated[EventService, Depends(get_event_service)],
) -> EventResponse:
    """Update an event (Admin or Super Admin only)."""
    return await service.update_event(event_id, data)
