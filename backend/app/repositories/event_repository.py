"""Event repository."""

from supabase import Client

from app.schemas.event import EventCreate, EventResponse, EventUpdate


class EventRepository:
    """Handles database operations for the event domain."""

    def __init__(self, client: Client) -> None:
        self._client = client

    async def list_events(self) -> list[EventResponse]:
        """Fetch all events."""
        response = self._client.table("events").select("*").execute()
        return [EventResponse(**row) for row in response.data]

    async def get_event_by_id(self, event_id: str) -> EventResponse | None:
        """Fetch a single event by ID."""
        response = (
            self._client.table("events").select("*").eq("id", event_id).maybe_single().execute()
        )
        if not response.data:
            return None
        return EventResponse(**response.data)

    async def create_event(self, data: EventCreate, user_id: str) -> EventResponse | None:
        """Create a new event."""
        payload = data.model_dump(exclude_unset=True, mode="json")
        payload["created_by"] = user_id

        response = self._client.table("events").insert(payload).execute()
        if not response.data:
            return None
        return EventResponse(**response.data[0])

    async def update_event(self, event_id: str, data: EventUpdate) -> EventResponse | None:
        """Update an existing event."""
        payload = data.model_dump(exclude_unset=True, mode="json")

        response = self._client.table("events").update(payload).eq("id", event_id).execute()
        if not response.data:
            return None
        return EventResponse(**response.data[0])
