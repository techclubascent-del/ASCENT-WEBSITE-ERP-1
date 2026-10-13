"""
Custom HTTP exceptions and global exception handler registration.

Rules:
- Use these exception classes in service and repository layers.
- The global handler converts them to consistent ErrorResponse JSON.
- Never leak internal exception details to clients in production.
"""

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from app.schemas.common import ErrorResponse

# ── Custom exception classes ───────────────────────────────────────────────


class AscentError(Exception):
    """Base class for all ASCENT application errors."""

    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    detail: str = "An unexpected error occurred."
    code: str | None = None

    def __init__(self, detail: str | None = None, code: str | None = None) -> None:
        self.detail = detail or self.__class__.detail
        self.code = code or self.__class__.code
        super().__init__(self.detail)


class NotFoundError(AscentError):
    """Raised when a requested resource does not exist."""

    status_code = status.HTTP_404_NOT_FOUND
    detail = "The requested resource was not found."
    code = "NOT_FOUND"


class ForbiddenError(AscentError):
    """Raised when the authenticated user lacks permission for an operation."""

    status_code = status.HTTP_403_FORBIDDEN
    detail = "You do not have permission to perform this action."
    code = "FORBIDDEN"


class UnauthorizedError(AscentError):
    """Raised when a request is not authenticated."""

    status_code = status.HTTP_401_UNAUTHORIZED
    detail = "Authentication is required."
    code = "UNAUTHORIZED"


class ConflictError(AscentError):
    """Raised when an operation conflicts with existing state (e.g. duplicate)."""

    status_code = status.HTTP_409_CONFLICT
    detail = "A conflict occurred with the current state of the resource."
    code = "CONFLICT"


class ValidationError(AscentError):
    """Raised for business-level validation failures (distinct from Pydantic)."""

    status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
    detail = "The provided data is invalid."
    code = "VALIDATION_ERROR"


# ── Global exception handler registration ─────────────────────────────────


def register_exception_handlers(app: FastAPI) -> None:
    """Register global exception handlers on the FastAPI app instance."""

    @app.exception_handler(AscentError)
    async def ascent_error_handler(_request: Request, exc: AscentError) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content=ErrorResponse(detail=exc.detail, code=exc.code).model_dump(),
        )
