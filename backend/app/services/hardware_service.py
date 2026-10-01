"""Hardware pass service layer."""

from app.repositories.hardware_repository import HardwareRepository
from app.schemas.hardware import HardwarePassCreate, HardwarePassResponse
from app.schemas.user import UserResponse


class HardwareService:
    def __init__(self, repository: HardwareRepository) -> None:
        self._repo = repository

    async def get_my_pass(self, current_user: UserResponse) -> HardwarePassResponse | None:
        """Get the active hardware pass for the current user."""
        return await self._repo.get_pass_by_user(current_user.id)

    async def request_pass(
        self, data: HardwarePassCreate, current_user: UserResponse
    ) -> HardwarePassResponse | None:
        """Request a new hardware pass, booking a workstation."""
        # Additional business logic like capacity checks could go here
        return await self._repo.create_pass(data, current_user.id)
