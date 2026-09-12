"""Attendance repository."""

from typing import Any, cast

from supabase import Client

from app.schemas.attendance import AttendanceCreate, AttendanceResponse, AttendanceUpdate


class AttendanceRepository:
    """Handles database operations for the attendance domain."""

    def __init__(self, client: Client) -> None:
        self._client = client

    async def record_attendance(self, data: AttendanceCreate) -> AttendanceResponse:
        """Record a single attendance entry."""
        payload = data.model_dump(mode="json")
        res = self._client.table("attendance").insert(payload).execute()
        rows: list[dict[str, Any]] = cast(list[dict[str, Any]], res.data)
        return AttendanceResponse(**rows[0])

    async def list_user_attendance(self, user_id: str) -> list[AttendanceResponse]:
        """Fetch all attendance records for a given user."""
        res = self._client.table("attendance").select("*").eq("user_id", user_id).execute()
        rows: list[dict[str, Any]] = cast(list[dict[str, Any]], res.data)
        return [AttendanceResponse(**a) for a in rows]

    async def list_event_attendance(self, event_id: str) -> list[AttendanceResponse]:
        """Fetch all attendance records for a given event."""
        res = self._client.table("attendance").select("*").eq("event_id", event_id).execute()
        rows: list[dict[str, Any]] = cast(list[dict[str, Any]], res.data)
        return [AttendanceResponse(**a) for a in rows]

    async def update_attendance(
        self, attendance_id: str, data: AttendanceUpdate
    ) -> AttendanceResponse:
        """Update an existing attendance record."""
        payload = data.model_dump(exclude_unset=True, mode="json")
        res = (
            self._client.table("attendance")
            .update(payload)
            .eq("id", attendance_id)
            .execute()
        )
        if not res.data:
            from app.core.exceptions import NotFoundError
            raise NotFoundError(detail="Attendance record not found")
        rows: list[dict[str, Any]] = cast(list[dict[str, Any]], res.data)
        return AttendanceResponse(**rows[0])

    async def delete_attendance(self, attendance_id: str) -> None:
        """Hard-delete an attendance record."""
        self._client.table("attendance").delete().eq("id", attendance_id).execute()
