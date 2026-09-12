"""Certificate service."""

from app.repositories.certificate_repository import CertificateRepository
from app.schemas.certificate import CertificateCreate, CertificateResponse, CertificateUpdate


class CertificateService:
    def __init__(self, repository: CertificateRepository) -> None:
        self._repository = repository

    async def create_certificate(self, data: CertificateCreate) -> CertificateResponse:
        return await self._repository.create_certificate(data)

    async def list_user_certificates(self, user_id: str) -> list[CertificateResponse]:
        return await self._repository.list_user_certificates(user_id)

    async def update_certificate(
        self, certificate_id: str, data: CertificateUpdate
    ) -> CertificateResponse:
        return await self._repository.update_certificate(certificate_id, data)

    async def delete_certificate(self, certificate_id: str) -> None:
        await self._repository.delete_certificate(certificate_id)
