import hmac

from fastapi import Header, HTTPException, status

from .config import get_settings


def _verify(value: str | None, expected: str) -> None:
    if not value or not hmac.compare_digest(value, f"Bearer {expected}"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid bearer token")


async def require_api_token(authorization: str | None = Header(default=None)) -> None:
    _verify(authorization, get_settings().api_token)


async def require_agent_token(authorization: str | None = Header(default=None)) -> None:
    _verify(authorization, get_settings().agent_token)
