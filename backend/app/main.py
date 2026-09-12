"""
ASCENT FastAPI application factory.

Architecture notes (ARCHITECTURE.md):
- Routes are thin — no business logic here.
- Global exception handlers are registered at the app level.
- CORS is configured from environment variables.
"""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import router as v1_router
from app.config import get_settings
from app.core.exceptions import register_exception_handlers


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan context manager.
    Add startup/shutdown logic here (e.g., connection pool warm-up).
    """
    # ── Startup ──────────────────────────────────────────────
    yield
    # ── Shutdown ─────────────────────────────────────────────


def create_app() -> FastAPI:
    """Build and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title="ASCENT API",
        description="Backend API for the ASCENT opportunities platform.",
        version="0.1.0",
        # Disable OpenAPI in production
        docs_url="/docs" if settings.is_development else None,
        redoc_url="/redoc" if settings.is_development else None,
        lifespan=lifespan,
    )

    # ── CORS ──────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Exception handlers ────────────────────────────────────
    register_exception_handlers(app)

    # ── Routers ───────────────────────────────────────────────
    app.include_router(v1_router)

    return app


# The app instance — uvicorn targets this.
app = create_app()
