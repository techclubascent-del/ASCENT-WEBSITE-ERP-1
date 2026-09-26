import json
from pathlib import Path

from pydantic import BaseModel

STATE_FILE = Path(__file__).parent / "system_state.json"

class SystemState(BaseModel):
    is_locked_down: bool = False

def _load_state() -> SystemState:
    if STATE_FILE.exists():
        try:
            with open(STATE_FILE) as f:
                data = json.load(f)
                return SystemState(**data)
        except Exception:
            pass
    return SystemState()

def _save_state(state: SystemState) -> None:
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, "w") as f:
        f.write(state.model_dump_json(indent=2))

class SystemStateManager:
    """Manages global system state, like the kill switch."""
    
    _instance = None
    _state: SystemState = SystemState()

    def __new__(cls) -> "SystemStateManager":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._state = _load_state()
        return cls._instance

    @property
    def is_locked_down(self) -> bool:
        return self._state.is_locked_down

    def set_lockdown(self, locked: bool) -> None:
        self._state.is_locked_down = locked
        _save_state(self._state)

# Global singleton
system_state = SystemStateManager()
