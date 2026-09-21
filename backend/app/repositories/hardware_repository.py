"""Hardware passes repository."""

from supabase import Client

from app.schemas.hardware import HardwarePassCreate, HardwarePassResponse

class HardwareRepository:
    """Handles database operations for the hardware passes domain."""

    def __init__(self, client: Client) -> None:
        self._client = client

    async def get_pass_by_user(self, user_id: str) -> HardwarePassResponse | None:
        """Fetch the latest active hardware pass for a user."""
        try:
            response = (
                self._client.table("hardware_passes")
                .select("*")
                .eq("user_id", user_id)
                .eq("status", "active")
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
            if not response.data:
                return None
            return HardwarePassResponse(**response.data[0])
        except Exception:
            # If table doesn't exist or other DB errors occur, return None gracefully
            return None

    async def create_pass(self, data: HardwarePassCreate, user_id: str) -> HardwarePassResponse | None:
        """Create a new hardware pass."""
        payload = data.model_dump(exclude_unset=True, mode="json")
        payload["user_id"] = user_id
        payload["status"] = "active"

        try:
            # Optionally mark previous active passes for this user as 'completed'
            self._client.table("hardware_passes").update({"status": "completed"}).eq("user_id", user_id).eq("status", "active").execute()
            
            response = self._client.table("hardware_passes").insert(payload).execute()
            if not response.data:
                return None
            return HardwarePassResponse(**response.data[0])
        except Exception as e:
            print(f"Error creating hardware pass: {e}")
            return None
