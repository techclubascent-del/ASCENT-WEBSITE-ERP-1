"""Certificate repository."""

from typing import Any, cast

from supabase import Client

from app.schemas.certificate import CertificateCreate, CertificateResponse, CertificateUpdate


class CertificateRepository:
    """Handles database operations for the certificate domain."""

    def __init__(self, client: Client) -> None:
        self._client = client

    async def create_certificate(self, data: CertificateCreate) -> CertificateResponse:
        """Issue a new certificate."""
        payload = data.model_dump(mode="json")
        res = self._client.table("certificates").insert(payload).execute()
        rows: list[dict[str, Any]] = cast(list[dict[str, Any]], res.data)
        return CertificateResponse(**rows[0])

    async def list_user_certificates(self, user_id: str) -> list[CertificateResponse]:
        """Fetch all certificates for a user."""
        res = self._client.table("certificates").select("*").eq("user_id", user_id).execute()
        rows: list[dict[str, Any]] = cast(list[dict[str, Any]], res.data)
        return [CertificateResponse(**c) for c in rows]

    async def update_certificate(
        self, certificate_id: str, data: CertificateUpdate
    ) -> CertificateResponse:
        """Update a certificate's fields."""
        payload = data.model_dump(exclude_unset=True, mode="json")
        res = (
            self._client.table("certificates")
            .update(payload)
            .eq("id", certificate_id)
            .execute()
        )
        if not res.data:
            from app.core.exceptions import NotFoundError
            raise NotFoundError(detail="Certificate not found")
        rows: list[dict[str, Any]] = cast(list[dict[str, Any]], res.data)
        return CertificateResponse(**rows[0])

    async def delete_certificate(self, certificate_id: str) -> None:
        """Hard-delete a certificate."""
        self._client.table("certificates").delete().eq("id", certificate_id).execute()
