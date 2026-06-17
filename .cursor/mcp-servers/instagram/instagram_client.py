"""Instagram client using username/password login via instagrapi."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from instagrapi import Client
from instagrapi.exceptions import ChallengeRequired, LoginRequired, TwoFactorRequired

SERVER_ROOT = Path(__file__).resolve().parent
SESSION_FILE = SERVER_ROOT / "instagram_session.json"


class InstagramError(RuntimeError):
    pass


class InstagramClient:
    def __init__(self) -> None:
        self._client = Client()
        self._logged_in = False

    def _require_env(self, name: str) -> str:
        value = os.environ.get(name, "").strip()
        if not value:
            raise InstagramError(
                f"Missing {name}. Set it in .cursor/mcp-servers/instagram/.env"
            )
        return value

    def login(self) -> None:
        if self._logged_in:
            return

        username = self._require_env("INSTAGRAM_USERNAME")
        password = self._require_env("INSTAGRAM_PASSWORD")
        verification_code = os.environ.get("INSTAGRAM_VERIFICATION_CODE", "").strip()

        if SESSION_FILE.is_file():
            self._client.load_settings(SESSION_FILE)

        try:
            self._client.login(username, password, verification_code=verification_code or None)
        except TwoFactorRequired as exc:
            raise InstagramError(
                "Instagram requires 2FA. Set INSTAGRAM_VERIFICATION_CODE in .env and retry."
            ) from exc
        except ChallengeRequired as exc:
            raise InstagramError(
                "Instagram login challenge required. Open instagram.com in a browser, "
                "approve the login, then retry — or set INSTAGRAM_VERIFICATION_CODE."
            ) from exc
        except Exception as exc:
            raise InstagramError(f"Instagram login failed: {exc}") from exc

        self._client.dump_settings(SESSION_FILE)
        self._logged_in = True

    def account_info(self) -> dict[str, Any]:
        self.login()
        account = self._client.account_info()
        user = self._client.user_info(self._client.user_id)
        return {
            "username": account.username,
            "full_name": account.full_name,
            "user_id": str(account.pk),
            "is_business": account.is_business,
            "is_verified": account.is_verified,
            "media_count": user.media_count,
            "follower_count": user.follower_count,
            "following_count": user.following_count,
        }

    def publish_photo(self, image_path: Path, caption: str) -> dict[str, Any]:
        self.login()
        if not image_path.is_file():
            raise InstagramError(f"Image not found: {image_path}")

        try:
            media = self._client.photo_upload(str(image_path), caption)
        except LoginRequired as exc:
            SESSION_FILE.unlink(missing_ok=True)
            self._logged_in = False
            raise InstagramError("Session expired. Retry after re-login.") from exc
        except Exception as exc:
            raise InstagramError(f"Failed to publish photo: {exc}") from exc

        return {
            "media_id": str(media.pk),
            "code": media.code,
            "url": f"https://www.instagram.com/p/{media.code}/",
        }
