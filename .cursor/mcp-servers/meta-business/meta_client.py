"""Meta Graph API client for Facebook Page + Instagram Business publishing."""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.parse
import webbrowser
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from threading import Thread
from typing import Any

import requests

GRAPH_VERSION = "v22.0"
GRAPH_BASE = f"https://graph.facebook.com/{GRAPH_VERSION}"

# Facebook Page publishing (Instagram campaign uses instagrapi + GitHub Actions).
FB_OAUTH_SCOPES = [
    "pages_show_list",
    "pages_read_engagement",
    "pages_manage_posts",
    "business_management",
]

SCOPES = FB_OAUTH_SCOPES

ROOT = Path(__file__).resolve().parent
CREDENTIALS_DIR = ROOT / "credentials"
APP_CREDENTIALS_PATH = CREDENTIALS_DIR / "app_credentials.json"
TOKEN_PATH = CREDENTIALS_DIR / "token.json"
OAUTH_REDIRECT_PORT = 8766
OAUTH_REDIRECT_URI = f"http://localhost:{OAUTH_REDIRECT_PORT}/callback"


class MetaBusinessError(RuntimeError):
    pass


def _require_env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise MetaBusinessError(
            f"Missing {name}. Set it in .cursor/mcp-servers/meta-business/.env"
        )
    return value


def _app_credentials() -> tuple[str, str]:
    app_id = os.environ.get("META_APP_ID", "").strip()
    app_secret = os.environ.get("META_APP_SECRET", "").strip()

    if APP_CREDENTIALS_PATH.is_file():
        data = json.loads(APP_CREDENTIALS_PATH.read_text())
        app_id = app_id or str(data.get("app_id", "")).strip()
        app_secret = app_secret or str(data.get("app_secret", "")).strip()

    if not app_id or not app_secret:
        raise MetaBusinessError(
            "Set META_APP_ID and META_APP_SECRET in .env, or save credentials/app_credentials.json"
        )
    return app_id, app_secret


def _load_token() -> dict[str, Any] | None:
    if not TOKEN_PATH.is_file():
        return None
    return json.loads(TOKEN_PATH.read_text())


def _save_token(data: dict[str, Any]) -> None:
    CREDENTIALS_DIR.mkdir(parents=True, exist_ok=True)
    TOKEN_PATH.write_text(json.dumps(data, indent=2))


def _graph_get(path: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
    response = requests.get(f"{GRAPH_BASE}{path}", params=params or {}, timeout=60)
    data = response.json()
    if not response.ok or "error" in data:
        raise MetaBusinessError(data.get("error", {}).get("message", response.text))
    return data


def _graph_post(path: str, params: dict[str, Any]) -> dict[str, Any]:
    response = requests.post(f"{GRAPH_BASE}{path}", data=params, timeout=120)
    data = response.json()
    if not response.ok or "error" in data:
        raise MetaBusinessError(data.get("error", {}).get("message", response.text))
    return data


def _graph_delete(path: str, params: dict[str, Any]) -> dict[str, Any]:
    response = requests.delete(f"{GRAPH_BASE}{path}", params=params, timeout=60)
    data = response.json()
    if not response.ok or "error" in data:
        raise MetaBusinessError(data.get("error", {}).get("message", response.text))
    return data


def _access_token() -> str:
    token = _load_token()
    if not token or not token.get("access_token"):
        raise MetaBusinessError(
            "Not authenticated. Run: .cursor/mcp-servers/meta-business/run.sh auth"
        )

    expires_at = token.get("expires_at")
    if expires_at and time.time() >= float(expires_at) - 300:
        raise MetaBusinessError(
            "Access token expired. Run: .cursor/mcp-servers/meta-business/run.sh auth"
        )
    return str(token["access_token"])


def _exchange_long_lived_token(short_token: str) -> dict[str, Any]:
    app_id, app_secret = _app_credentials()
    data = _graph_get(
        "/oauth/access_token",
        {
            "grant_type": "fb_exchange_token",
            "client_id": app_id,
            "client_secret": app_secret,
            "fb_exchange_token": short_token,
        },
    )
    expires_in = int(data.get("expires_in", 60 * 60 * 24 * 60))
    return {
        "access_token": data["access_token"],
        "token_type": data.get("token_type", "bearer"),
        "expires_at": time.time() + expires_in,
    }


def run_oauth_flow(*, open_browser: bool = True) -> dict[str, Any]:
    app_id, _ = _app_credentials()
    email = os.environ.get("META_ACCOUNT_EMAIL", "").strip()
    config_id = os.environ.get("META_LOGIN_CONFIG_ID", "").strip()
    state = "rasoi_meta_business"

    auth_params: dict[str, str] = {
        "client_id": app_id,
        "redirect_uri": OAUTH_REDIRECT_URI,
        "response_type": "code",
        "state": state,
    }
    if config_id:
        auth_params["config_id"] = config_id
    else:
        auth_params["scope"] = ",".join(SCOPES)
    if email:
        auth_params["auth_type"] = "rerequest"

    auth_url = f"https://www.facebook.com/{GRAPH_VERSION}/dialog/oauth?{urllib.parse.urlencode(auth_params)}"

    result: dict[str, str] = {}

    class CallbackHandler(BaseHTTPRequestHandler):
        def do_GET(self) -> None:  # noqa: N802
            parsed = urllib.parse.urlparse(self.path)
            query = urllib.parse.parse_qs(parsed.query)
            if parsed.path != "/callback":
                self.send_response(404)
                self.end_headers()
                return

            if query.get("state", [""])[0] != state:
                result["error"] = "OAuth state mismatch"
            elif "error" in query:
                result["error"] = query.get("error_description", query["error"])[0]
            else:
                result["code"] = query.get("code", [""])[0]

            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(
                b"<html><body><h2>Meta auth complete.</h2><p>You can close this tab.</p></body></html>"
            )

        def log_message(self, format: str, *args: object) -> None:
            return

    server = HTTPServer(("127.0.0.1", OAUTH_REDIRECT_PORT), CallbackHandler)
    thread = Thread(target=server.handle_request, daemon=True)
    thread.start()

    print(f"Meta OAuth: sign in as {email or 'your Meta account'} in the browser.", file=sys.stderr)
    if open_browser:
        webbrowser.open(auth_url)
    else:
        print(auth_url, file=sys.stderr)
    thread.join(timeout=300)
    server.server_close()

    if result.get("error"):
        raise MetaBusinessError(result["error"])
    if not result.get("code"):
        raise MetaBusinessError("OAuth timed out or was cancelled.")

    app_id, app_secret = _app_credentials()
    short = _graph_get(
        "/oauth/access_token",
        {
            "client_id": app_id,
            "client_secret": app_secret,
            "redirect_uri": OAUTH_REDIRECT_URI,
            "code": result["code"],
        },
    )
    long_lived = _exchange_long_lived_token(short["access_token"])
    _save_token(long_lived)
    return {
        "ok": True,
        "auth_url": auth_url,
        "token_path": str(TOKEN_PATH),
        "expires_at": long_lived["expires_at"],
    }


def auth_status() -> dict[str, Any]:
    app_id, app_secret = "", ""
    try:
        app_id, app_secret = _app_credentials()
    except MetaBusinessError:
        pass

    token = _load_token()
    authenticated = False
    expires_at: float | None = None
    if token and token.get("access_token"):
        expires_at = token.get("expires_at")
        authenticated = not expires_at or time.time() < float(expires_at)

    return {
        "authenticated": authenticated,
        "meta_account_email": os.environ.get("META_ACCOUNT_EMAIL", "").strip() or None,
        "app_id_configured": bool(app_id),
        "app_secret_configured": bool(app_secret),
        "token_configured": TOKEN_PATH.is_file(),
        "token_expires_at": (
            datetime.fromtimestamp(float(expires_at), tz=timezone.utc).isoformat()
            if expires_at
            else None
        ),
        "default_page_id": os.environ.get("META_PAGE_ID", "").strip() or None,
        "default_ig_user_id": os.environ.get("META_IG_USER_ID", "").strip() or None,
        "scopes": SCOPES,
        "credentials_dir": str(CREDENTIALS_DIR),
        "note": (
            "Uses Meta Graph API (same backend as Business Suite). "
            "No direct Business Suite UI API exists."
        ),
    }


def _parse_schedule_time(scheduled_at: str) -> int:
    text = scheduled_at.strip()
    if text.isdigit():
        return int(text)

    normalized = text.replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(normalized)
    except ValueError as exc:
        raise MetaBusinessError(
            f"Invalid scheduled_at: {scheduled_at}. Use ISO 8601 or Unix seconds."
        ) from exc

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return int(dt.timestamp())


def _validate_schedule_window(unix_time: int) -> int:
    now = int(time.time())
    min_time = now + 10 * 60
    max_time = now + 30 * 24 * 60 * 60
    if unix_time < min_time or unix_time > max_time:
        raise MetaBusinessError(
            "scheduled_at must be between 10 minutes and 30 days from now (Facebook Pages API limit)."
        )
    return unix_time


def list_connected_accounts() -> dict[str, Any]:
    token = _access_token()
    data = _graph_get(
        "/me/accounts",
        {
            "access_token": token,
            "fields": "id,name,access_token,instagram_business_account{id,username,name}",
            "limit": 50,
        },
    )

    pages: list[dict[str, Any]] = []
    for page in data.get("data", []):
        ig = page.get("instagram_business_account") or {}
        pages.append(
            {
                "page_id": page.get("id"),
                "page_name": page.get("name"),
                "page_access_token": page.get("access_token"),
                "instagram_user_id": ig.get("id"),
                "instagram_username": ig.get("username"),
                "instagram_name": ig.get("name"),
            }
        )

    return {"pages": pages, "count": len(pages)}


def _resolve_page(page_id: str = "") -> dict[str, Any]:
    target = page_id.strip() or os.environ.get("META_PAGE_ID", "").strip()
    accounts = list_connected_accounts()["pages"]
    if not accounts:
        raise MetaBusinessError("No Facebook Pages found for this Meta account.")

    if target:
        for page in accounts:
            if page["page_id"] == target:
                return page
        raise MetaBusinessError(f"Page {target} not found or not accessible.")

    if len(accounts) == 1:
        return accounts[0]
    raise MetaBusinessError(
        "Multiple pages found. Pass page_id or set META_PAGE_ID in .env."
    )


def _resolve_instagram(ig_user_id: str = "", page: dict[str, Any] | None = None) -> str:
    target = ig_user_id.strip() or os.environ.get("META_IG_USER_ID", "").strip()
    if target:
        return target

    page = page or _resolve_page()
    ig_id = page.get("instagram_user_id")
    if not ig_id:
        raise MetaBusinessError(
            "No Instagram Business account linked to this Facebook Page."
        )
    return str(ig_id)


def _upload_unpublished_photo(
    page: dict[str, Any],
    *,
    image_path: Path | None = None,
    image_url: str = "",
) -> str:
    """Upload image without publishing; returns photo id for feed scheduling."""
    params: dict[str, Any] = {
        "access_token": page["page_access_token"],
        "published": "false",
        "temporary": "true",
    }
    if image_path and image_path.is_file():
        with image_path.open("rb") as image_file:
            response = requests.post(
                f"{GRAPH_BASE}/{page['page_id']}/photos",
                data=params,
                files={"source": image_file},
                timeout=120,
            )
    elif image_url.strip():
        params["url"] = image_url.strip()
        response = requests.post(
            f"{GRAPH_BASE}/{page['page_id']}/photos",
            data=params,
            timeout=120,
        )
    else:
        raise MetaBusinessError("image_path or image_url is required for photo posts.")

    data = response.json()
    if not response.ok or "error" in data:
        raise MetaBusinessError(data.get("error", {}).get("message", response.text))
    photo_id = data.get("id")
    if not photo_id:
        raise MetaBusinessError(f"Photo upload did not return an id: {data}")
    return str(photo_id)


def schedule_facebook_post(
    message: str,
    scheduled_at: str,
    page_id: str = "",
    image_url: str = "",
    image_path: str = "",
    link: str = "",
) -> dict[str, Any]:
    page = _resolve_page(page_id)
    publish_time = _validate_schedule_window(_parse_schedule_time(scheduled_at))
    local_path = Path(image_path.strip()) if image_path.strip() else None

    if (local_path and local_path.is_file()) or image_url.strip():
        # Two-step: unpublished photo + scheduled feed post (shows on correct calendar day).
        photo_id = _upload_unpublished_photo(
            page,
            image_path=local_path,
            image_url=image_url,
        )
        feed_params: dict[str, Any] = {
            "access_token": page["page_access_token"],
            "message": message.strip(),
            "attached_media": json.dumps([{"media_fbid": photo_id}]),
            "published": "false",
            "scheduled_publish_time": str(publish_time),
            "unpublished_content_type": "SCHEDULED",
        }
        if link.strip():
            feed_params["link"] = link.strip()
        return _graph_post(f"/{page['page_id']}/feed", feed_params)

    params: dict[str, Any] = {
        "access_token": page["page_access_token"],
        "message": message.strip(),
        "published": "false",
        "scheduled_publish_time": str(publish_time),
        "unpublished_content_type": "SCHEDULED",
    }
    if link.strip():
        params["link"] = link.strip()
    return _graph_post(f"/{page['page_id']}/feed", params)


def publish_facebook_now(
    message: str,
    page_id: str = "",
    image_url: str = "",
    image_path: str = "",
    link: str = "",
) -> dict[str, Any]:
    page = _resolve_page(page_id)
    params: dict[str, Any] = {
        "access_token": page["page_access_token"],
        "published": "true",
    }

    local_path = Path(image_path.strip()) if image_path.strip() else None
    if local_path and local_path.is_file():
        params["caption"] = message.strip()
        if link.strip():
            params["link"] = link.strip()
        with local_path.open("rb") as image_file:
            response = requests.post(
                f"{GRAPH_BASE}/{page['page_id']}/photos",
                data=params,
                files={"source": image_file},
                timeout=120,
            )
        data = response.json()
        if not response.ok or "error" in data:
            raise MetaBusinessError(data.get("error", {}).get("message", response.text))
        return data

    if image_url.strip():
        params["url"] = image_url.strip()
        params["caption"] = message.strip()
        if link.strip():
            params["link"] = link.strip()
        return _graph_post(f"/{page['page_id']}/photos", params)

    params["message"] = message.strip()
    if link.strip():
        params["link"] = link.strip()
    return _graph_post(f"/{page['page_id']}/feed", params)


def list_facebook_scheduled_posts(page_id: str = "", limit: int = 20) -> dict[str, Any]:
    page = _resolve_page(page_id)
    data = _graph_get(
        f"/{page['page_id']}/scheduled_posts",
        {
            "access_token": page["page_access_token"],
            "fields": "id,message,scheduled_publish_time,created_time,permalink_url",
            "limit": max(1, min(limit, 50)),
        },
    )
    return {"page_id": page["page_id"], "scheduled_posts": data.get("data", [])}


def _create_instagram_container(
    ig_user_id: str,
    caption: str,
    image_url: str,
    page_access_token: str,
    scheduled_publish_time: int | None = None,
) -> dict[str, Any]:
    params: dict[str, Any] = {
        "access_token": page_access_token,
        "image_url": image_url.strip(),
        "caption": caption.strip(),
    }
    if scheduled_publish_time is not None:
        params["published"] = "false"
        params["scheduled_publish_time"] = str(scheduled_publish_time)

    return _graph_post(f"/{ig_user_id}/media", params)


def _publish_instagram_container(
    ig_user_id: str,
    creation_id: str,
    page_access_token: str,
) -> dict[str, Any]:
    return _graph_post(
        f"/{ig_user_id}/media_publish",
        {
            "access_token": page_access_token,
            "creation_id": creation_id,
        },
    )


def publish_instagram_photo(
    caption: str,
    image_url: str,
    ig_user_id: str = "",
    page_id: str = "",
) -> dict[str, Any]:
    page = _resolve_page(page_id)
    ig_id = _resolve_instagram(ig_user_id, page)
    container = _create_instagram_container(
        ig_id,
        caption,
        image_url,
        page["page_access_token"],
    )
    published = _publish_instagram_container(
        ig_id,
        str(container["id"]),
        page["page_access_token"],
    )
    return {
        "instagram_user_id": ig_id,
        "container_id": container.get("id"),
        "media_id": published.get("id"),
        "scheduled": False,
    }


def schedule_instagram_photo(
    caption: str,
    image_url: str,
    scheduled_at: str,
    ig_user_id: str = "",
    page_id: str = "",
) -> dict[str, Any]:
    page = _resolve_page(page_id)
    ig_id = _resolve_instagram(ig_user_id, page)
    publish_time = _validate_schedule_window(_parse_schedule_time(scheduled_at))

    try:
        container = _create_instagram_container(
            ig_id,
            caption,
            image_url,
            page["page_access_token"],
            scheduled_publish_time=publish_time,
        )
        published = _publish_instagram_container(
            ig_id,
            str(container["id"]),
            page["page_access_token"],
        )
        return {
            "instagram_user_id": ig_id,
            "container_id": container.get("id"),
            "media_id": published.get("id"),
            "scheduled_publish_time": publish_time,
            "scheduled": True,
            "method": "graph_api_native",
        }
    except MetaBusinessError as exc:
        if "scheduled_publish_time" not in str(exc).lower():
            raise

    from scheduler import add_local_post

    row = add_local_post(
        platform="instagram",
        caption=caption,
        image_url=image_url,
        scheduled_at=scheduled_at,
        ig_user_id=ig_id,
        page_id=page["page_id"],
    )
    return {
        "instagram_user_id": ig_id,
        "scheduled": True,
        "method": "local_queue",
        "note": (
            "Instagram native scheduling unavailable for this account. "
            "Queued locally — run meta_run_due_scheduled_posts or run.sh run-due."
        ),
        **row,
    }
