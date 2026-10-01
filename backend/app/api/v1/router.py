"""
Versioned API v1 router.

All domain routers are registered here.
Adding a new feature domain: create its router and include it below.
"""

from fastapi import APIRouter

from app.api.v1 import (
    applications,
    attendance,
    audit,
    certificates,
    events,
    health,
    messages,
    opportunities,
    posts,
    system,
    users,
)

router = APIRouter(prefix="/api/v1")

router.include_router(health.router)
router.include_router(users.router)
router.include_router(opportunities.router)
router.include_router(applications.router)
router.include_router(events.router)
router.include_router(certificates.router)
router.include_router(attendance.router)
router.include_router(audit.router)
router.include_router(system.router)
router.include_router(posts.router)
router.include_router(messages.router)
