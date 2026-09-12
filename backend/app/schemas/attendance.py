"""Attendance schemas."""

from datetime import datetime

from pydantic import BaseModel


class AttendanceBase(BaseModel):
    """Base fields for attendance."""

    user_id: str
    event_id: str
    status: str  # e.g., "present", "absent", "excused"


class AttendanceCreate(AttendanceBase):
    """Data required to mark attendance."""
    
    pass


class AttendanceUpdate(BaseModel):
    """Optional fields to update an existing attendance record."""

    status: str


class AttendanceResponse(AttendanceBase):
    """Data returned to the client."""

    id: str
    marked_at: datetime
    created_at: datetime
