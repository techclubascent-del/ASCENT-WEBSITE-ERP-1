from collections.abc import Awaitable, Callable

from fastapi import Request, Response
from fastapi.responses import JSONResponse
from jose import JWTError, jwt
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import get_settings
from app.core.state import system_state
from app.schemas.user import UserRole


class KillSwitchMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        if not system_state.is_locked_down:
            return await call_next(request)

        # Allow bypass paths
        allowed_paths = [
            "/api/v1/health",
            "/api/v1/system/status",
            "/api/v1/system/lockdown",
            "/docs",
            "/openapi.json",
        ]
        if request.url.path in allowed_paths:
            return await call_next(request)

        # In lockdown mode, only super_admins can make requests
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=503,
                content={"detail": "System is currently in maintenance mode."},
            )

        token = auth_header.split(" ")[1]
        settings = get_settings()
        try:
            payload = jwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                options={"verify_aud": False},
            )
            role_str = payload.get("user_metadata", {}).get("role", UserRole.MEMBER)
            if role_str != UserRole.SUPER_ADMIN.value:
                return JSONResponse(
                    status_code=503,
                    content={"detail": "System is currently in maintenance mode."},
                )
        except JWTError:
            # Let the actual auth dependency handle invalid tokens if needed, 
            # but in lockdown we just reject them.
            return JSONResponse(
                status_code=503,
                content={"detail": "System is currently in maintenance mode."},
            )

        # Super admin allowed
        return await call_next(request)
