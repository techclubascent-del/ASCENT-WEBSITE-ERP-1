"""Attendance routes."""

from typing import Annotated

from fastapi import APIRouter, Depends
from supabase import Client

from app.core.dependencies import AdminUser, CurrentUser, get_supabase_client
from app.repositories.attendance_repository import AttendanceRepository
from app.schemas.attendance import AttendanceCreate, AttendanceResponse, AttendanceUpdate
from app.services.attendance_service import AttendanceService

router = APIRouter(prefix="/attendance", tags=["attendance"])


def get_attendance_service(
    client: Annotated[Client, Depends(get_supabase_client)],
) -> AttendanceService:
    repo = AttendanceRepository(client)
    return AttendanceService(repo)


@router.get("/me", response_model=list[AttendanceResponse])
async def list_my_attendance(
    current_user: CurrentUser,
    service: Annotated[AttendanceService, Depends(get_attendance_service)],
) -> list[AttendanceResponse]:
    """List all attendance records for the authenticated user."""
    return await service.list_user_attendance(current_user.id)


@router.get("/user/{user_id}", response_model=list[AttendanceResponse])
async def list_user_attendance(
    user_id: str,
    _current_user: AdminUser,
    service: Annotated[AttendanceService, Depends(get_attendance_service)],
) -> list[AttendanceResponse]:
    """List all attendance records for a specific user (Admin or Super Admin only)."""
    return await service.list_user_attendance(user_id)


@router.get("/event/{event_id}", response_model=list[AttendanceResponse])
async def list_event_attendance(
    event_id: str,
    _current_user: AdminUser,
    service: Annotated[AttendanceService, Depends(get_attendance_service)],
) -> list[AttendanceResponse]:
    """List all attendance records for a specific event (Admin or Super Admin only)."""
    return await service.list_event_attendance(event_id)


@router.post("", response_model=AttendanceResponse)
async def record_attendance(
    data: AttendanceCreate,
    _current_user: AdminUser,
    service: Annotated[AttendanceService, Depends(get_attendance_service)],
) -> AttendanceResponse:
    """Record attendance for a user at an event (Admin or Super Admin only)."""
    return await service.record_attendance(data)


@router.patch("/{attendance_id}", response_model=AttendanceResponse)
async def update_attendance(
    attendance_id: str,
    data: AttendanceUpdate,
    _current_user: AdminUser,
    service: Annotated[AttendanceService, Depends(get_attendance_service)],
) -> AttendanceResponse:
    """Update an attendance record (Admin or Super Admin only)."""
    return await service.update_attendance(attendance_id, data)


@router.delete("/{attendance_id}", status_code=204)
async def delete_attendance(
    attendance_id: str,
    _current_user: AdminUser,
    service: Annotated[AttendanceService, Depends(get_attendance_service)],
) -> None:
    """Delete an attendance record (Admin or Super Admin only)."""
    await service.delete_attendance(attendance_id)
