"""
FastAPI dependency injection — authentication and authorization.

These dependencies are injected into route handlers via Depends().
Authorization is always enforced server-side — frontend checks are UX only.

Usage:
    @router.get("/me")
    async def get_me(current_user: CurrentUser) -> UserResponse:
        ...
"""
from typing import Annotated

from fastapi import Depends, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from supabase import Client

from app.config import Settings, get_settings
from app.core.exceptions import ForbiddenError, UnauthorizedError
from app.schemas.user import UserResponse, UserRole

# ── Supabase client dependency ─────────────────────────────────────────────

bearer_scheme = HTTPBearer(auto_error=False)


def get_supabase_client(settings: Annotated[Settings, Depends(get_settings)]) -> Client:
    """Return a Supabase client using the service role key for admin operations."""
    from supabase import create_client

    return create_client(settings.supabase_url, settings.supabase_service_role_key)


# ── Current user dependency ────────────────────────────────────────────────


async def get_current_user(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Security(bearer_scheme)
    ],
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
        raise UnauthorizedError(detail="Invalid or expired token.")

    user_id: str | None = payload.get("sub")
    email: str | None = payload.get("email")
    role_str: str = payload.get("user_metadata", {}).get("role", UserRole.USER)

    if not user_id or not email:
        raise UnauthorizedError(detail="Token payload is malformed.")

    try:
        role = UserRole(role_str)
    except ValueError:
        role = UserRole.USER

    return UserResponse(id=user_id, email=email, role=role)


# ── Role-restricted dependencies ───────────────────────────────────────────


async def require_admin(
    current_user: Annotated[UserResponse, Depends(get_current_user)],
) -> UserResponse:
    """Restrict a route to admin users only."""
    if current_user.role != UserRole.ADMIN:
        raise ForbiddenError()
    return current_user


async def require_organizer_or_admin(
    current_user: Annotated[UserResponse, Depends(get_current_user)],
) -> UserResponse:
    """Restrict a route to organizers and admins."""
    if current_user.role not in (UserRole.ORGANIZER, UserRole.ADMIN):
        raise ForbiddenError()
    return current_user


# ── Typed aliases for cleaner route signatures ─────────────────────────────

CurrentUser = Annotated[UserResponse, Depends(get_current_user)]
AdminUser = Annotated[UserResponse, Depends(require_admin)]
OrganizerOrAdminUser = Annotated[UserResponse, Depends(require_organizer_or_admin)]
