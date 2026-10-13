import psutil
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.dependencies import require_super_admin
from app.core.state import system_state
from app.schemas.user import UserResponse

router = APIRouter(prefix="/system", tags=["System"])

class KillSwitchStatus(BaseModel):
    is_locked_down: bool
    cpu_percent: float = 0.0
    memory_percent: float = 0.0
    disk_percent: float = 0.0

@router.get("/status", response_model=KillSwitchStatus)
async def get_system_status() -> KillSwitchStatus:
    """Get the current system lockdown status and health metrics (Public for display)."""
    cpu = psutil.cpu_percent(interval=None)
    mem = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent
    return KillSwitchStatus(
        is_locked_down=system_state.is_locked_down,
        cpu_percent=cpu,
        memory_percent=mem,
        disk_percent=disk
    )

class KillSwitchUpdate(BaseModel):
    locked: bool

@router.post("/lockdown", response_model=KillSwitchStatus)
async def toggle_lockdown(
    data: KillSwitchUpdate,
    current_user: UserResponse = Depends(require_super_admin)
) -> KillSwitchStatus:
    """Toggle the global kill switch (Super Admin Only)."""
    system_state.set_lockdown(data.locked)
    return KillSwitchStatus(is_locked_down=system_state.is_locked_down)
