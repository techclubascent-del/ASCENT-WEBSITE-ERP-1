"""Opportunity schemas."""

from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel


class OpportunityStatus(StrEnum):
    """Status of an opportunity."""

    DRAFT = "draft"
    PUBLISHED = "published"
    CLOSED = "closed"


class OpportunityBase(BaseModel):
    """Base fields for an opportunity."""

    title: str
    description: str
    status: OpportunityStatus = OpportunityStatus.DRAFT
    deadline: datetime | None = None
    published_at: datetime | None = None


class OpportunityCreate(OpportunityBase):
    """Data required to create a new opportunity."""

    pass


class OpportunityUpdate(BaseModel):
    """Optional fields to update an existing opportunity."""

    title: str | None = None
    description: str | None = None
    status: OpportunityStatus | None = None
    deadline: datetime | None = None
    published_at: datetime | None = None


class OpportunityResponse(OpportunityBase):
    """Data returned to the client."""

    id: str
    created_by: str
    created_at: datetime
