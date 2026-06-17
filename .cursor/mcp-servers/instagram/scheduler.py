"""Campaign and custom post scheduling for Rasoi Instagram ads."""

from __future__ import annotations

import json
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

SERVER_ROOT = Path(__file__).resolve().parent
REPO_ROOT = SERVER_ROOT.parents[2]
PROMPTS_FILE = REPO_ROOT / "docs" / "marketing" / "AD_IMAGE_PROMPTS.md"
AD_IMAGES_DIR = REPO_ROOT / "docs" / "marketing" / "ad-images"
STATE_FILE = SERVER_ROOT / "schedule-state.json"
CUSTOM_FILE = SERVER_ROOT / "custom-schedule.json"

IST = timezone(timedelta(hours=5, minutes=30))
CAMPAIGN_START = datetime(2026, 6, 17, 19, 0, tzinfo=IST)
POST_INTERVAL = timedelta(days=1)

HASHTAGS = (
    "#Rasoi #RasoiApp #IndianFood #HomeCooking #DesiFood #IndianKitchen "
    "#WhatsForDinner #AajKyaBanaye #FoodTech #IndianStartup"
)


def _read_state() -> dict[str, Any]:
    if not STATE_FILE.is_file():
        return {"published": {}}
    return json.loads(STATE_FILE.read_text(encoding="utf-8"))


def _write_state(state: dict[str, Any]) -> None:
    STATE_FILE.write_text(json.dumps(state, indent=2), encoding="utf-8")


def _read_custom() -> list[dict[str, Any]]:
    if not CUSTOM_FILE.is_file():
        return []
    return json.loads(CUSTOM_FILE.read_text(encoding="utf-8"))


def _write_custom(rows: list[dict[str, Any]]) -> None:
    CUSTOM_FILE.write_text(json.dumps(rows, indent=2), encoding="utf-8")


def _parse_campaign_ads() -> list[dict[str, Any]]:
    text = PROMPTS_FILE.read_text(encoding="utf-8")
    pattern = re.compile(
        r"## Ad (\d+) —[^\n]*\n\n"
        r"(?:.*?\n)*?"
        r"\*\*Headline:\*\* (.+?)\n"
        r"\*\*Subheadline:\*\* (.+?)\n",
        re.MULTILINE,
    )
    ads: list[dict[str, Any]] = []
    for match in pattern.finditer(text):
        post_id = int(match.group(1))
        image_matches = sorted(AD_IMAGES_DIR.glob(f"{post_id:02d}-*.png"))
        if not image_matches:
            continue
        scheduled_at = CAMPAIGN_START + POST_INTERVAL * (post_id - 1)
        ads.append(
            {
                "id": post_id,
                "headline": match.group(2).strip(),
                "subheadline": match.group(3).strip(),
                "image_path": str(image_matches[0].relative_to(REPO_ROOT)),
                "scheduled_at": scheduled_at.isoformat(),
            }
        )
    return ads


def build_caption(headline: str, subheadline: str) -> str:
    return (
        f"{headline}\n\n"
        f"{subheadline}\n\n"
        "Download Rasoi Free — your Indian kitchen companion.\n\n"
        f"{HASHTAGS}"
    )


def resolve_repo_path(path: str) -> Path:
    candidate = Path(path)
    if candidate.is_file():
        return candidate.resolve()
    repo_path = (REPO_ROOT / path).resolve()
    if repo_path.is_file():
        return repo_path
    raise FileNotFoundError(f"Image not found: {path}")


def load_campaign_posts() -> list[dict[str, Any]]:
    state = _read_state()
    published = state.get("published", {})
    rows: list[dict[str, Any]] = []
    for ad in _parse_campaign_ads():
        post_id = str(ad["id"])
        pub = published.get(post_id)
        rows.append(
            {
                **ad,
                "caption": build_caption(ad["headline"], ad["subheadline"]),
                "published": bool(pub),
                "published_at": pub.get("published_at") if pub else None,
                "media_id": pub.get("media_id") if pub else None,
                "url": pub.get("url") if pub else None,
            }
        )
    return rows


def get_campaign_post(post_id: int) -> dict[str, Any]:
    for row in load_campaign_posts():
        if row["id"] == post_id:
            return row
    raise KeyError(f"Campaign post {post_id} not found")


def mark_campaign_published(post_id: int, result: dict[str, Any]) -> None:
    state = _read_state()
    published = state.setdefault("published", {})
    published[str(post_id)] = {
        "published_at": datetime.now(tz=IST).isoformat(),
        "media_id": result.get("media_id"),
        "url": result.get("url"),
    }
    _write_state(state)


def get_due_campaign_posts(now: datetime | None = None) -> list[dict[str, Any]]:
    now = now or datetime.now(tz=IST)
    due: list[dict[str, Any]] = []
    for row in load_campaign_posts():
        if row["published"]:
            continue
        scheduled_at = datetime.fromisoformat(row["scheduled_at"])
        if scheduled_at <= now:
            due.append(row)
    return sorted(due, key=lambda row: row["id"])


def campaign_overview(limit: int = 20, include_published: bool = True) -> list[dict[str, Any]]:
    rows = load_campaign_posts()
    if not include_published:
        rows = [row for row in rows if not row["published"]]
    return rows[:limit]


def add_custom_post(
    image_path: str,
    caption: str,
    scheduled_at: str,
) -> dict[str, Any]:
    scheduled = datetime.fromisoformat(scheduled_at)
    if scheduled.tzinfo is None:
        scheduled = scheduled.replace(tzinfo=IST)
    row = {
        "id": f"custom-{int(datetime.now(tz=IST).timestamp())}",
        "image_path": image_path,
        "caption": caption,
        "scheduled_at": scheduled.isoformat(),
        "published": False,
    }
    rows = _read_custom()
    rows.append(row)
    _write_custom(rows)
    return row


def list_custom_posts(include_published: bool = True) -> list[dict[str, Any]]:
    rows = _read_custom()
    if include_published:
        return rows
    return [row for row in rows if not row.get("published")]


def get_due_custom_posts(now: datetime | None = None) -> list[dict[str, Any]]:
    now = now or datetime.now(tz=IST)
    due: list[dict[str, Any]] = []
    for row in list_custom_posts(include_published=False):
        scheduled_at = datetime.fromisoformat(row["scheduled_at"])
        if scheduled_at <= now:
            due.append(row)
    return due


def mark_custom_published(post_id: str, result: dict[str, Any]) -> None:
    rows = _read_custom()
    for row in rows:
        if row["id"] == post_id:
            row["published"] = True
            row["published_at"] = datetime.now(tz=IST).isoformat()
            row["media_id"] = result.get("media_id")
            row["url"] = result.get("url")
    _write_custom(rows)
