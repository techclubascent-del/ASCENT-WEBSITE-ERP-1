"""Certificates routes."""

from typing import Annotated

from fastapi import APIRouter, Depends
from supabase import Client

from app.core.dependencies import AdminUser, CurrentUser, get_supabase_client
from app.repositories.certificate_repository import CertificateRepository
from app.schemas.certificate import CertificateCreate, CertificateResponse, CertificateUpdate
from app.services.certificate_service import CertificateService

router = APIRouter(prefix="/certificates", tags=["certificates"])


def get_certificate_service(
    client: Annotated[Client, Depends(get_supabase_client)],
) -> CertificateService:
    repo = CertificateRepository(client)
    return CertificateService(repo)


@router.get("/me", response_model=list[CertificateResponse])
async def list_my_certificates(
    current_user: CurrentUser,
    service: Annotated[CertificateService, Depends(get_certificate_service)],
) -> list[CertificateResponse]:
    """List all certificates for the authenticated user."""
    return await service.list_user_certificates(current_user.id)


@router.get("/user/{user_id}", response_model=list[CertificateResponse])
async def list_user_certificates(
    user_id: str,
    _current_user: AdminUser,
    service: Annotated[CertificateService, Depends(get_certificate_service)],
) -> list[CertificateResponse]:
    """List all certificates for a specific user (Admin or Super Admin only)."""
    return await service.list_user_certificates(user_id)


@router.post("", response_model=CertificateResponse)
async def create_certificate(
    data: CertificateCreate,
    _current_user: AdminUser,
    service: Annotated[CertificateService, Depends(get_certificate_service)],
) -> CertificateResponse:
    """Issue a new certificate to a user (Admin or Super Admin only)."""
    return await service.create_certificate(data)


@router.patch("/{certificate_id}", response_model=CertificateResponse)
async def update_certificate(
    certificate_id: str,
    data: CertificateUpdate,
    _current_user: AdminUser,
    service: Annotated[CertificateService, Depends(get_certificate_service)],
) -> CertificateResponse:
    """Update a certificate (Admin or Super Admin only)."""
    return await service.update_certificate(certificate_id, data)


@router.delete("/{certificate_id}", status_code=204)
async def delete_certificate(
    certificate_id: str,
    _current_user: AdminUser,
    service: Annotated[CertificateService, Depends(get_certificate_service)],
) -> None:
    """Delete a certificate (Admin or Super Admin only)."""
    await service.delete_certificate(certificate_id)
