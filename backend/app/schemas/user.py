"""User-domain Pydantic schemas.

These define what the API accepts and returns — not the database model.
Never expose raw database rows directly as API responses.
"""

from enum import StrEnum

from pydantic import BaseModel, EmailStr


class UserRole(StrEnum):
    """
    Roles a user can hold in ASCENT.

    - member:      Default role. Can browse opportunities, submit applications,
                   view own progress and get notified of events.
    - admin:       Core team. Manages content, members, certificates, events,
                   applications, and can assign roles up to 'admin'.
    - super_admin: Platform owner. Full access including security, site health,
                   and can promote/demote super_admin accounts.
    """

    MEMBER = "member"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


class UserResponse(BaseModel):
    """Returned whenever the API exposes a user object."""

    id: str
    email: EmailStr
    role: UserRole


class RoleAssignRequest(BaseModel):
    """Request body for assigning a role to a user."""

    role: UserRole


class ProfileResponse(BaseModel):
    """Public-facing user profile data."""

    id: str
    user_id: str
    full_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None


class ProfileUpdate(BaseModel):
    """Data required to update a user profile."""

    full_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
