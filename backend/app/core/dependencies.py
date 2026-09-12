"""
FastAPI dependency injection — authentication and authorization.

These dependencies are injected into route handlers via Depends().
Authorization is always enforced server-side — frontend checks are UX only.

Usage:
    @router.get("/me")
    async def get_me(current_user: CurrentUser) -> UserResponse:
        ...

    @router.post("/opportunities")
    async def create(current_user: AdminUser) -> OpportunityResponse:
        ...
"""

from typing import Annotated

from fastapi import Depends, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from supabase import Client, create_client

from app.config import Settings, get_settings
from app.core.exceptions import ForbiddenError, UnauthorizedError
from app.schemas.user import UserResponse, UserRole

# ── Supabase client dependency ─────────────────────────────────────────────

bearer_scheme = HTTPBearer(auto_error=False)


def get_supabase_client(settings: Annotated[Settings, Depends(get_settings)]) -> Client:
    """Return a Supabase client using the service role key for admin operations."""
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


# ── Current user dependency ────────────────────────────────────────────────


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Security(bearer_scheme)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> UserResponse:
    """
    Validate the Supabase JWT from the Authorization header and return the
    current user. Raises UnauthorizedError if the token is missing or invalid.

    This dependency is the security boundary — all protected routes MUST use it.
    """
    if credentials is None:
        raise UnauthorizedError()

    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
    except JWTError:
        raise UnauthorizedError(detail="Invalid or expired token.") from None

    user_id: str | None = payload.get("sub")
    email: str | None = payload.get("email")
    role_str: str = payload.get("user_metadata", {}).get("role", UserRole.MEMBER)

    if not user_id or not email:
        raise UnauthorizedError(detail="Token payload is malformed.")

    try:
        role = UserRole(role_str)
    except ValueError:
        role = UserRole.MEMBER

    return UserResponse(id=user_id, email=email, role=role)


# ── Role-restricted dependencies ───────────────────────────────────────────


async def require_admin(
    current_user: Annotated[UserResponse, Depends(get_current_user)],
) -> UserResponse:
    """
    Restrict a route to admin and super_admin users.
    Admins can manage content, members, certificates, and assign roles up to 'admin'.
    """
    if current_user.role not in (UserRole.ADMIN, UserRole.SUPER_ADMIN):
        raise ForbiddenError()
    return current_user


async def require_super_admin(
    current_user: Annotated[UserResponse, Depends(get_current_user)],
) -> UserResponse:
    """
    Restrict a route to super_admin users only.
    Super admins have full platform access including security and role promotion.
    """
    if current_user.role != UserRole.SUPER_ADMIN:
        raise ForbiddenError()
    return current_user


# ── Typed aliases for cleaner route signatures ─────────────────────────────

CurrentUser = Annotated[UserResponse, Depends(get_current_user)]
AdminUser = Annotated[UserResponse, Depends(require_admin)]
SuperAdminUser = Annotated[UserResponse, Depends(require_super_admin)]
