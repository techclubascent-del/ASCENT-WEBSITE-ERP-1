"""Attendance service."""

from app.repositories.attendance_repository import AttendanceRepository
from app.schemas.attendance import AttendanceCreate, AttendanceResponse, AttendanceUpdate


class AttendanceService:
    def __init__(self, repository: AttendanceRepository) -> None:
        self._repository = repository

    async def record_attendance(self, data: AttendanceCreate) -> AttendanceResponse:
        # Business logic can go here (e.g., check if event exists)
        return await self._repository.record_attendance(data)

    async def list_user_attendance(self, user_id: str) -> list[AttendanceResponse]:
        return await self._repository.list_user_attendance(user_id)
        
    async def list_event_attendance(self, event_id: str) -> list[AttendanceResponse]:
        return await self._repository.list_event_attendance(event_id)

    async def update_attendance(
        self, attendance_id: str, data: AttendanceUpdate
    ) -> AttendanceResponse:
        return await self._repository.update_attendance(attendance_id, data)

    async def delete_attendance(self, attendance_id: str) -> None:
        await self._repository.delete_attendance(attendance_id)
