"""Certificate schemas."""

from datetime import datetime

from pydantic import BaseModel


class CertificateBase(BaseModel):
    """Base fields for a certificate."""

    user_id: str
    title: str
    issued_by: str | None = None
    url: str | None = None


class CertificateCreate(CertificateBase):
    """Data required to issue a new certificate."""
    
    issued_at: datetime


class CertificateUpdate(BaseModel):
    """Optional fields to update an existing certificate."""

    title: str | None = None
    issued_by: str | None = None
    url: str | None = None
    issued_at: datetime | None = None


class CertificateResponse(CertificateBase):
    """Data returned to the client."""

    id: str
    issued_at: datetime
    created_at: datetime
