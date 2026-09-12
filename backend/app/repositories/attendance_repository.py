"""Attendance repository."""

from supabase import Client

from app.schemas.attendance import AttendanceCreate, AttendanceResponse, AttendanceUpdate


class AttendanceRepository:
    def __init__(self, client: Client) -> None:
        self._client = client

    async def record_attendance(self, data: AttendanceCreate) -> AttendanceResponse:
        payload = data.model_dump(mode="json")
        res = self._client.table("attendance").insert(payload).execute()
        return AttendanceResponse(**res.data[0])

    async def list_user_attendance(self, user_id: str) -> list[AttendanceResponse]:
        res = self._client.table("attendance").select("*").eq("user_id", user_id).execute()
        return [AttendanceResponse(**a) for a in res.data]

    async def list_event_attendance(self, event_id: str) -> list[AttendanceResponse]:
        res = self._client.table("attendance").select("*").eq("event_id", event_id).execute()
        return [AttendanceResponse(**a) for a in res.data]

    async def update_attendance(
        self, attendance_id: str, data: AttendanceUpdate
    ) -> AttendanceResponse:
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
        return AttendanceResponse(**res.data[0])

    async def delete_attendance(self, attendance_id: str) -> None:
        self._client.table("attendance").delete().eq("id", attendance_id).execute()
