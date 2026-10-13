"""Application service."""

from app.core.exceptions import ForbiddenError, NotFoundError
from app.repositories.application_repository import ApplicationRepository
from app.schemas.application import ApplicationCreate, ApplicationResponse, ApplicationUpdate
from app.schemas.user import UserResponse, UserRole


class ApplicationService:
    """Business operations for the application domain."""

    def __init__(self, repository: ApplicationRepository) -> None:
        self._repository = repository

    async def list_user_applications(self, user_id: str) -> list[ApplicationResponse]:
        """Fetch all applications for a specific user."""
        return await self._repository.list_applications(user_id=user_id)

    async def list_opportunity_applications(self, opportunity_id: str) -> list[ApplicationResponse]:
        """Fetch all applications for a specific opportunity (Admin/Organizer)."""
        return await self._repository.list_applications(opportunity_id=opportunity_id)

    async def get_application(
        self, application_id: str, current_user: UserResponse
    ) -> ApplicationResponse:
        """Fetch a single application, raising 404 if not found.
        Members can only see their own applications; admins can see any.
        """
        application = await self._repository.get_application_by_id(application_id)
        if not application:
            raise NotFoundError(f"Application {application_id} not found.")
        if (
            current_user.role == UserRole.MEMBER
            and application.user_id != current_user.id
        ):
            raise ForbiddenError(detail="You can only view your own applications.")
        return application

    async def submit_application(
        self, data: ApplicationCreate, user_id: str
    ) -> ApplicationResponse:
        """
        Submit a new application.
        TODO: Validate that the user hasn't already applied to this opportunity.
        TODO: Validate that the opportunity is published and open.
        """
        created = await self._repository.create_application(data, user_id)
        if not created:
            raise NotFoundError("Failed to create application.")
        return created

    async def update_application_status(
        self, application_id: str, data: ApplicationUpdate
    ) -> ApplicationResponse:
        """Update application status (Admin/Organizer)."""
        await self.get_application(application_id)
        updated = await self._repository.update_application(application_id, data)
        if not updated:
            raise NotFoundError("Failed to update application.")
        return updated
