"""Application schemas."""
from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel


class ApplicationStatus(StrEnum):
    """Status of an application."""

    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class ApplicationBase(BaseModel):
    """Base fields for an application."""

    opportunity_id: str
    answers: dict[str, str] = {}


class ApplicationCreate(ApplicationBase):
    """Data required to create a new application."""

    pass


class ApplicationUpdate(BaseModel):
    """Optional fields to update an existing application."""

    answers: dict[str, str] | None = None
    status: ApplicationStatus | None = None


class ApplicationResponse(ApplicationBase):
    """Data returned to the client."""

    id: str
    user_id: str
    status: ApplicationStatus
    submitted_at: datetime | None = None
    created_at: datetime
