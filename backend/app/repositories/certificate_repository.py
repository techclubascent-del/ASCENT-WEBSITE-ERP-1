"""Certificate repository."""

from supabase import Client

from app.schemas.certificate import CertificateCreate, CertificateResponse, CertificateUpdate


class CertificateRepository:
    def __init__(self, client: Client) -> None:
        self._client = client

    async def create_certificate(self, data: CertificateCreate) -> CertificateResponse:
        payload = data.model_dump(mode="json")
        res = self._client.table("certificates").insert(payload).execute()
        return CertificateResponse(**res.data[0])

    async def list_user_certificates(self, user_id: str) -> list[CertificateResponse]:
        res = self._client.table("certificates").select("*").eq("user_id", user_id).execute()
        return [CertificateResponse(**c) for c in res.data]

    async def update_certificate(
        self, certificate_id: str, data: CertificateUpdate
    ) -> CertificateResponse:
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
        return CertificateResponse(**res.data[0])

    async def delete_certificate(self, certificate_id: str) -> None:
        self._client.table("certificates").delete().eq("id", certificate_id).execute()
