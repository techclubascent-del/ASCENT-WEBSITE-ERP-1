"""Opportunity routes."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from app.core.dependencies import AdminUser, CurrentUser, get_supabase_client
from app.repositories.opportunity_repository import OpportunityRepository
from app.schemas.opportunity import OpportunityCreate, OpportunityResponse, OpportunityUpdate
from app.services.opportunity_service import OpportunityService

router = APIRouter(prefix="/opportunities", tags=["opportunities"])


def get_opportunity_service(
    client: Annotated[Client, Depends(get_supabase_client)],
) -> OpportunityService:
    """Dependency injection for the opportunity service."""
    repo = OpportunityRepository(client)
    return OpportunityService(repo)


@router.get("", response_model=list[OpportunityResponse])
async def list_opportunities(
    service: Annotated[OpportunityService, Depends(get_opportunity_service)],
) -> list[OpportunityResponse]:
    """List all *published* opportunities (public — no auth required)."""
    return await service.list_opportunities(published_only=True)


@router.get("/admin/all", response_model=list[OpportunityResponse])
async def list_all_opportunities(
    _current_user: AdminUser,
    service: Annotated[OpportunityService, Depends(get_opportunity_service)],
) -> list[OpportunityResponse]:
    """List ALL opportunities including drafts (Admin or Super Admin only)."""
    return await service.list_opportunities(published_only=False)


@router.get("/{opportunity_id}", response_model=OpportunityResponse)
async def get_opportunity(
    opportunity_id: str,
    service: Annotated[OpportunityService, Depends(get_opportunity_service)],
) -> OpportunityResponse:
    """Get a specific opportunity by ID."""
    return await service.get_opportunity(opportunity_id)


@router.post("", response_model=OpportunityResponse)
async def create_opportunity(
    data: OpportunityCreate,
    current_user: CurrentUser,
    service: Annotated[OpportunityService, Depends(get_opportunity_service)],
) -> OpportunityResponse:
    """Create a new opportunity (Member or Admin)."""
    return await service.create_opportunity(data, current_user.id)


@router.patch("/{opportunity_id}", response_model=OpportunityResponse)
async def update_opportunity(
    opportunity_id: str,
    data: OpportunityUpdate,
    _current_user: AdminUser,
    service: Annotated[OpportunityService, Depends(get_opportunity_service)],
) -> OpportunityResponse:
    """Update an opportunity (Admin or Super Admin only)."""
    return await service.update_opportunity(opportunity_id, data)
