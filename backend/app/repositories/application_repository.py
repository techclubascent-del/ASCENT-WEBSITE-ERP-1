"""Application repository."""
from supabase import Client

from app.schemas.application import ApplicationCreate, ApplicationResponse, ApplicationUpdate


class ApplicationRepository:
    """Handles database operations for the application domain."""

    def __init__(self, client: Client) -> None:
        self._client = client

    async def list_applications(
        self, user_id: str | None = None, opportunity_id: str | None = None
    ) -> list[ApplicationResponse]:
        """Fetch applications, optionally filtered by user or opportunity."""
        query = self._client.table("applications").select("*")
        if user_id:
            query = query.eq("user_id", user_id)
        if opportunity_id:
            query = query.eq("opportunity_id", opportunity_id)
            
        response = query.execute()
        return [ApplicationResponse(**row) for row in response.data]

    async def get_application_by_id(self, application_id: str) -> ApplicationResponse | None:
        """Fetch a single application by ID."""
        response = self._client.table("applications").select("*").eq("id", application_id).maybe_single().execute()
        if not response.data:
            return None
        return ApplicationResponse(**response.data)

    async def create_application(
        self, data: ApplicationCreate, user_id: str
    ) -> ApplicationResponse | None:
        """Create a new application."""
        payload = data.model_dump(exclude_unset=True)
        payload["user_id"] = user_id

        response = self._client.table("applications").insert(payload).execute()
        if not response.data:
            return None
        return ApplicationResponse(**response.data[0])

    async def update_application(
        self, application_id: str, data: ApplicationUpdate
    ) -> ApplicationResponse | None:
        """Update an existing application."""
        payload = data.model_dump(exclude_unset=True)
        response = self._client.table("applications").update(payload).eq("id", application_id).execute()
        if not response.data:
            return None
        return ApplicationResponse(**response.data[0])
