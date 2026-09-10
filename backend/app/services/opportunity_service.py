"""Opportunity service."""
from app.core.exceptions import NotFoundError
from app.repositories.opportunity_repository import OpportunityRepository
from app.schemas.opportunity import OpportunityCreate, OpportunityResponse, OpportunityUpdate


class OpportunityService:
    """Business operations for the opportunity domain."""

    def __init__(self, repository: OpportunityRepository) -> None:
        self._repository = repository

    async def list_opportunities(self) -> list[OpportunityResponse]:
        """Fetch all published opportunities (public view)."""
        # TODO: Add filters for status
        return await self._repository.list_opportunities()

    async def get_opportunity(self, opportunity_id: str) -> OpportunityResponse:
        """Fetch a single opportunity, raising 404 if not found."""
        opportunity = await self._repository.get_opportunity_by_id(opportunity_id)
        if not opportunity:
            raise NotFoundError(f"Opportunity {opportunity_id} not found.")
        return opportunity

    async def create_opportunity(
        self, data: OpportunityCreate, user_id: str
    ) -> OpportunityResponse:
        """Create an opportunity. Assumes caller is authorized (enforced in router)."""
        created = await self._repository.create_opportunity(data, user_id)
        if not created:
            raise NotFoundError("Failed to create opportunity.")
        return created

    async def update_opportunity(
        self, opportunity_id: str, data: OpportunityUpdate
    ) -> OpportunityResponse:
        """Update an opportunity. Assumes caller is authorized (enforced in router)."""
        # Ensure it exists
        await self.get_opportunity(opportunity_id)
        
        updated = await self._repository.update_opportunity(opportunity_id, data)
        if not updated:
            raise NotFoundError("Failed to update opportunity.")
        return updated
