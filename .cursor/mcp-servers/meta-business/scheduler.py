"""Local post queue when Instagram native scheduling is unavailable."""

from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from meta_client import MetaBusinessError, _parse_schedule_time

SERVER_ROOT = Path(__file__).resolve().parent
SCHEDULE_FILE = SERVER_ROOT / "local-schedule.json"


def _read() -> dict[str, Any]:
    if not SCHEDULE_FILE.is_file():
        return {"posts": []}
    return json.loads(SCHEDULE_FILE.read_text())


def _write(data: dict[str, Any]) -> None:
    SCHEDULE_FILE.write_text(json.dumps(data, indent=2, ensure_ascii=False))


def add_local_post(
    platform: str,
    caption: str,
    image_url: str,
    scheduled_at: str,
    ig_user_id: str = "",
    page_id: str = "",
) -> dict[str, Any]:
    publish_time = _parse_schedule_time(scheduled_at)
    row = {
        "id": str(uuid.uuid4()),
        "platform": platform,
        "caption": caption.strip(),
        "image_url": image_url.strip(),
        "scheduled_at": datetime.fromtimestamp(publish_time, tz=timezone.utc).isoformat(),
        "scheduled_unix": publish_time,
        "ig_user_id": ig_user_id,
        "page_id": page_id,
        "published": False,
        "url": None,
        "error": None,
    }
    data = _read()
    data.setdefault("posts", []).append(row)
    _write(data)
    return row


def list_local_posts(include_published: bool = False, limit: int = 50) -> list[dict[str, Any]]:
    posts = _read().get("posts", [])
    if not include_published:
        posts = [p for p in posts if not p.get("published")]
    posts = sorted(posts, key=lambda p: p.get("scheduled_unix", 0))
    return posts[: max(1, min(limit, 200))]


def get_due_posts(now_unix: int | None = None) -> list[dict[str, Any]]:
    now = now_unix if now_unix is not None else int(datetime.now(tz=timezone.utc).timestamp())
    return [
        p
        for p in list_local_posts(include_published=False, limit=200)
        if int(p.get("scheduled_unix", 0)) <= now
    ]


def mark_published(post_id: str, url: str | None = None) -> None:
    data = _read()
    for post in data.get("posts", []):
        if post.get("id") == post_id:
            post["published"] = True
            post["url"] = url
            post["error"] = None
            break
    _write(data)


def mark_failed(post_id: str, error: str) -> None:
    data = _read()
    for post in data.get("posts", []):
        if post.get("id") == post_id:
            post["error"] = error
            break
    _write(data)


def run_due_posts(dry_run: bool = False) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    for post in get_due_posts():
        preview = {
            "id": post["id"],
            "platform": post["platform"],
            "scheduled_at": post["scheduled_at"],
            "caption_preview": post["caption"][:120],
        }
        if dry_run:
            results.append({**preview, "dry_run": True})
            continue

        try:
            if post["platform"] != "instagram":
                raise MetaBusinessError(f"Unsupported platform: {post['platform']}")

            from meta_client import publish_instagram_photo

            result = publish_instagram_photo(
                caption=post["caption"],
                image_url=post["image_url"],
                ig_user_id=post.get("ig_user_id", ""),
                page_id=post.get("page_id", ""),
            )
            mark_published(post["id"], url=result.get("media_id"))
            results.append({**preview, "ok": True, **result})
        except MetaBusinessError as exc:
            mark_failed(post["id"], str(exc))
            results.append({**preview, "ok": False, "error": str(exc)})

    return results
