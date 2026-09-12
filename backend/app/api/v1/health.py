"""Health check route."""

from fastapi import APIRouter

from app.schemas.common import HealthResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    tags=["system"],
)
async def health_check() -> HealthResponse:
    """
    Returns a simple health status.
    Used by deployment infrastructure and CI to confirm the service is up.
    """
    return HealthResponse(status="ok")
