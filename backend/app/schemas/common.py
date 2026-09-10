"""
Shared Pydantic schemas used across multiple domains.
"""
from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Response schema for the health check endpoint."""

    status: str = "ok"


class ErrorResponse(BaseModel):
    """Standard error response returned by the global exception handler."""

    detail: str
    code: str | None = None
