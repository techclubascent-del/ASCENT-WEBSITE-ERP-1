"""User-domain Pydantic schemas.

These define what the API accepts and returns — not the database model.
Never expose raw database rows directly as API responses.
"""
from enum import StrEnum

from pydantic import BaseModel, EmailStr


class UserRole(StrEnum):
    """Roles a user can hold in ASCENT."""

    USER = "user"
    ORGANIZER = "organizer"
    ADMIN = "admin"


class UserResponse(BaseModel):
    """Returned whenever the API exposes a user object."""

    id: str
    email: EmailStr
    role: UserRole


class ProfileResponse(BaseModel):
    """Public-facing user profile data."""

    id: str
    user_id: str
    full_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
