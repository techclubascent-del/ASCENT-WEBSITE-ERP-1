from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class HardwarePassBase(BaseModel):
    assigned_lab: str = Field(..., description="The lab or bay assigned")
    active_quota: str = Field(..., description="The equipment or quota description")
    allocated_hours: int = Field(..., description="Number of hours booked/allocated")

class HardwarePassCreate(HardwarePassBase):
    pass

class HardwarePassResponse(HardwarePassBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    status: str
    created_at: datetime
