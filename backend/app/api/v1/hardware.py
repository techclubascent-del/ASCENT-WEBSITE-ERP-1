from typing import Annotated

from fastapi import APIRouter, Depends
from supabase import Client

from app.core.dependencies import CurrentUser, get_supabase_client
from app.repositories.hardware_repository import HardwareRepository
from app.schemas.hardware import HardwarePassCreate, HardwarePassResponse
from app.services.hardware_service import HardwareService

router = APIRouter(prefix="/hardware", tags=["hardware"])


def get_hardware_service(
    client: Annotated[Client, Depends(get_supabase_client)],
) -> HardwareService:
    """Dependency injection for the hardware service."""
    repo = HardwareRepository(client)
    return HardwareService(repo)


@router.get(
    "/me",
    response_model=HardwarePassResponse,
    summary="Get my hardware pass",
)
async def get_my_pass(
    current_user: CurrentUser,
    service: Annotated[HardwareService, Depends(get_hardware_service)],
) -> HardwarePassResponse:
    """Fetch the active hardware pass for the current user."""
    pass_data = await service.get_my_pass(current_user)
    if not pass_data:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="No active hardware pass found")
    return pass_data


@router.post(
    "",
    response_model=HardwarePassResponse,
    summary="Request a hardware pass",
)
async def request_pass(
    data: HardwarePassCreate,
    current_user: CurrentUser,
    service: Annotated[HardwareService, Depends(get_hardware_service)],
) -> HardwarePassResponse:
    """Request a new hardware pass (book a workstation)."""
    pass_data = await service.request_pass(data, current_user)
    if not pass_data:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail="Failed to create hardware pass")
    return pass_data
