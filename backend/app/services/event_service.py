"""Event service."""

from app.core.exceptions import NotFoundError
from app.repositories.event_repository import EventRepository
from app.schemas.event import EventCreate, EventResponse, EventUpdate


class EventService:
    """Business operations for the event domain."""

    def __init__(self, repository: EventRepository) -> None:
        self._repository = repository

    async def list_events(self) -> list[EventResponse]:
        """Fetch all events."""
        return await self._repository.list_events()

    async def get_event(self, event_id: str) -> EventResponse:
        """Fetch a single event, raising 404 if not found."""
        event = await self._repository.get_event_by_id(event_id)
        if not event:
            raise NotFoundError(f"Event {event_id} not found.")
        return event

    async def create_event(self, data: EventCreate, user_id: str) -> EventResponse:
        """Create an event. Assumes caller is authorized (enforced in router)."""
        created = await self._repository.create_event(data, user_id)
        if not created:
            raise NotFoundError("Failed to create event.")
        return created

    async def update_event(self, event_id: str, data: EventUpdate) -> EventResponse:
        """Update an event. Assumes caller is authorized (enforced in router)."""
        await self.get_event(event_id)
        updated = await self._repository.update_event(event_id, data)
        if not updated:
            raise NotFoundError("Failed to update event.")
        return updated
