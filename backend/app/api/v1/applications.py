"""Application routes."""
from typing import Annotated

from fastapi import APIRouter, Depends
from supabase import Client

from app.core.dependencies import CurrentUser, OrganizerOrAdminUser, get_supabase_client
from app.repositories.application_repository import ApplicationRepository
from app.schemas.application import ApplicationCreate, ApplicationResponse, ApplicationUpdate
from app.services.application_service import ApplicationService

router = APIRouter(prefix="/applications", tags=["applications"])


def get_application_service(
    client: Annotated[Client, Depends(get_supabase_client)],
) -> ApplicationService:
    """Dependency injection for the application service."""
    repo = ApplicationRepository(client)
    return ApplicationService(repo)


@router.get("/me", response_model=list[ApplicationResponse])
async def list_my_applications(
    current_user: CurrentUser,
    service: Annotated[ApplicationService, Depends(get_application_service)],
) -> list[ApplicationResponse]:
    """List all applications submitted by the current user."""
    return await service.list_user_applications(current_user.id)


@router.get("/opportunity/{opportunity_id}", response_model=list[ApplicationResponse])
async def list_opportunity_applications(
    opportunity_id: str,
    _current_user: OrganizerOrAdminUser,
    service: Annotated[ApplicationService, Depends(get_application_service)],
) -> list[ApplicationResponse]:
    """List all applications for an opportunity (Organizer or Admin only)."""
    return await service.list_opportunity_applications(opportunity_id)


@router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application(
    application_id: str,
    _current_user: CurrentUser,  # TODO: Add fine-grained access check in service
    service: Annotated[ApplicationService, Depends(get_application_service)],
) -> ApplicationResponse:
    """Get a specific application by ID."""
    return await service.get_application(application_id)


@router.post("", response_model=ApplicationResponse)
async def submit_application(
    data: ApplicationCreate,
    current_user: CurrentUser,
    service: Annotated[ApplicationService, Depends(get_application_service)],
) -> ApplicationResponse:
    """Submit a new application."""
    return await service.submit_application(data, current_user.id)


@router.patch("/{application_id}", response_model=ApplicationResponse)
async def update_application_status(
    application_id: str,
    data: ApplicationUpdate,
    _current_user: OrganizerOrAdminUser,
    service: Annotated[ApplicationService, Depends(get_application_service)],
) -> ApplicationResponse:
    """Update application status (Organizer or Admin only)."""
    return await service.update_application_status(application_id, data)
