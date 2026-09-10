"""Opportunity repository."""
from supabase import Client

from app.schemas.opportunity import OpportunityCreate, OpportunityResponse, OpportunityUpdate


class OpportunityRepository:
    """Handles database operations for the opportunity domain."""

    def __init__(self, client: Client) -> None:
        self._client = client

    async def list_opportunities(self) -> list[OpportunityResponse]:
        """Fetch all opportunities."""
        response = self._client.table("opportunities").select("*").execute()
        return [OpportunityResponse(**row) for row in response.data]

    async def get_opportunity_by_id(self, opportunity_id: str) -> OpportunityResponse | None:
        """Fetch a single opportunity by ID."""
        response = self._client.table("opportunities").select("*").eq("id", opportunity_id).maybe_single().execute()
        if not response.data:
            return None
        return OpportunityResponse(**response.data)

    async def create_opportunity(
        self, data: OpportunityCreate, user_id: str
    ) -> OpportunityResponse | None:
        """Create a new opportunity."""
        payload = data.model_dump(exclude_unset=True)
        payload["created_by"] = user_id
        if payload.get("deadline"):
            payload["deadline"] = payload["deadline"].isoformat()

        response = self._client.table("opportunities").insert(payload).execute()
        if not response.data:
            return None
        return OpportunityResponse(**response.data[0])

    async def update_opportunity(
        self, opportunity_id: str, data: OpportunityUpdate
    ) -> OpportunityResponse | None:
        """Update an existing opportunity."""
        payload = data.model_dump(exclude_unset=True)
        if payload.get("deadline"):
            payload["deadline"] = payload["deadline"].isoformat()
            
        response = self._client.table("opportunities").update(payload).eq("id", opportunity_id).execute()
        if not response.data:
            return None
        return OpportunityResponse(**response.data[0])
