import json
import sqlite3
from typing import Any

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel

from app.core.dependencies import get_optional_user, require_super_admin
from app.schemas.user import UserResponse

router = APIRouter(prefix="/audit", tags=["Audit"])

DB_PATH = "audit.db"

class AuditLogCreate(BaseModel):
    action: str
    resource: str
    metadata: dict[str, Any] | None = {}

class AuditLogResponse(BaseModel):
    id: int
    user_id: str | None
    action: str
    resource: str
    metadata: dict[str, Any]
    ip_address: str | None
    user_agent: str | None
    created_at: str

@router.post("/log")
async def create_audit_log(
    data: AuditLogCreate,
    request: Request,
    current_user: UserResponse | None = Depends(get_optional_user)
) -> dict[str, str]:
    """Log an action or page visit from the frontend."""
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    user_id = str(current_user.id) if current_user else None

    # SQLite needs strings
    metadata_str = json.dumps(data.metadata)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO audit_logs (user_id, action, resource, metadata, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (user_id, data.action, data.resource, metadata_str, ip_address, user_agent)
    )
    conn.commit()
    conn.close()
    return {"status": "success"}

@router.get("/logs", response_model=list[AuditLogResponse])
async def get_audit_logs(
    limit: int = 100,
    current_user: UserResponse = Depends(require_super_admin)
) -> list[AuditLogResponse]:
    """Fetch recent audit logs for the live dashboard (Super Admin Only)."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()

    result = []
    for row in rows:
        result.append(AuditLogResponse(
            id=row["id"],
            user_id=row["user_id"],
            action=row["action"],
            resource=row["resource"],
            metadata=json.loads(row["metadata"]) if row["metadata"] else {},
            ip_address=row["ip_address"],
            user_agent=row["user_agent"],
            created_at=row["created_at"]
        ))
    return result
