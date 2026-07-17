"""Schedule Rasoi ad campaign to Facebook Page (same captions/images as Instagram)."""

from __future__ import annotations

import json
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
REPO_ROOT = ROOT.parents[2]
INSTAGRAM_SERVER = REPO_ROOT / ".cursor" / "mcp-servers" / "instagram"
STATE_FILE = ROOT / "fb-schedule-state.json"

IST = timezone(timedelta(hours=5, minutes=30))
FB_MAX_SCHEDULE_DAYS = 30
PUBLISH_GAP_SEC = 25


def _import_instagram_scheduler():
    if str(INSTAGRAM_SERVER) not in sys.path:
        sys.path.insert(0, str(INSTAGRAM_SERVER))
    from scheduler import (  # noqa: PLC0415
        CAMPAIGN_START,
        POST_HOUR,
        load_campaign_posts,
        resolve_repo_path,
    )

    return CAMPAIGN_START, POST_HOUR, load_campaign_posts, resolve_repo_path


def _next_daily_slot(after: datetime, *, post_hour: int) -> datetime:
    """Next daily slot (post_hour AM IST) strictly after `after`."""
    slot = after.astimezone(IST).replace(
        hour=post_hour, minute=0, second=0, microsecond=0
    )
    if slot <= after:
        slot += timedelta(days=1)
    return slot


def _campaign_slot(post_id: int, campaign_start: datetime) -> datetime:
    return campaign_start + timedelta(days=post_id - 1)


def _fb_schedule_time(
    post_id: int,
    now: datetime,
    *,
    campaign_start: datetime,
    post_hour: int,
    catch_up_day: int,
) -> datetime:
    """One post per calendar day — aligned to IG campaign start when still in the future."""
    min_time = now + timedelta(minutes=12)
    max_time = now + timedelta(days=FB_MAX_SCHEDULE_DAYS) - timedelta(minutes=5)
    target = _campaign_slot(post_id, campaign_start)

    if target < min_time:
        target = _next_daily_slot(min_time, post_hour=post_hour) + timedelta(
            days=catch_up_day
        )
    elif target > max_time:
        raise ValueError(f"Post {post_id} is beyond Facebook's 30-day schedule window")

    if target > max_time:
        raise ValueError(f"Post {post_id} is beyond Facebook's 30-day schedule window")
    return target


def _read_state() -> dict[str, Any]:
    if not STATE_FILE.is_file():
        return {"published": {}, "scheduled": {}}
    return json.loads(STATE_FILE.read_text(encoding="utf-8"))


def _write_state(state: dict[str, Any]) -> None:
    STATE_FILE.write_text(json.dumps(state, indent=2), encoding="utf-8")


def run_fb_campaign(
    *,
    schedule_future: bool = True,
    dry_run: bool = False,
    page_id: str = "",
    max_posts: int | None = None,
) -> dict[str, Any]:
    from meta_client import MetaBusinessError, schedule_facebook_post

    campaign_start, post_hour, load_campaign_posts, resolve_repo_path = (
        _import_instagram_scheduler()
    )
    rows = load_campaign_posts()
    state = _read_state()
    published_map = state.setdefault("published", {})
    scheduled_map = state.setdefault("scheduled", {})
    now = datetime.now(tz=IST)

    published: list[dict[str, Any]] = []
    scheduled: list[dict[str, Any]] = []
    skipped: list[dict[str, Any]] = []
    errors: list[dict[str, Any]] = []
    catch_up_day = 0
    queued_this_run = 0

    for row in rows:
        if max_posts is not None and queued_this_run >= max_posts:
            break

        pid = row["id"]
        key = str(pid)

        if key in published_map or key in scheduled_map:
            skipped.append({"id": pid, "reason": "already on Facebook"})
            continue

        if not schedule_future:
            continue

        image_path = resolve_repo_path(row["image_path"])
        caption = row["caption"]

        try:
            campaign_target = _campaign_slot(pid, campaign_start)
            min_time = now + timedelta(minutes=12)
            day_offset = catch_up_day if campaign_target < min_time else 0
            if campaign_target < min_time:
                catch_up_day += 1

            sched_dt = _fb_schedule_time(
                pid,
                now,
                campaign_start=campaign_start,
                post_hour=post_hour,
                catch_up_day=day_offset,
            )

            if dry_run:
                scheduled.append(
                    {
                        "id": pid,
                        "dry_run": True,
                        "scheduled_at": sched_dt.isoformat(),
                        "campaign_day": campaign_target.isoformat(),
                    }
                )
                queued_this_run += 1
                continue

            result = schedule_facebook_post(
                message=caption,
                scheduled_at=sched_dt.isoformat(),
                page_id=page_id,
                image_path=str(image_path),
            )
            scheduled_map[key] = {
                "scheduled_at": sched_dt.isoformat(),
                "campaign_day": campaign_target.isoformat(),
                "fb_post_id": result.get("id") or result.get("post_id"),
                "queued_at": now.isoformat(),
            }
            scheduled.append(
                {"id": pid, "scheduled_at": sched_dt.isoformat(), **result}
            )
            queued_this_run += 1
            time.sleep(PUBLISH_GAP_SEC)

        except ValueError as exc:
            if "30-day schedule window" in str(exc):
                skipped.append({"id": pid, "reason": str(exc)})
                continue
            errors.append({"id": pid, "error": str(exc)})
            if not dry_run:
                break
        except (MetaBusinessError, FileNotFoundError) as exc:
            errors.append({"id": pid, "error": str(exc)})
            if not dry_run:
                break

    if not dry_run:
        _write_state(state)

    return {
        "ok": not errors,
        "published": published,
        "scheduled": scheduled,
        "skipped": skipped,
        "errors": errors,
        "note": (
            "One Facebook post per day at 10 AM IST (same calendar as Instagram). "
            f"Facebook allows scheduling up to {FB_MAX_SCHEDULE_DAYS} days ahead — "
            "re-run weekly to queue the next batch."
        ),
    }


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Schedule Rasoi campaign on Facebook Page")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--page-id", default="")
    parser.add_argument("--no-schedule", action="store_true")
    parser.add_argument(
        "--max-posts",
        type=int,
        default=None,
        help="Cap how many new slots to queue this run (default: all that fit in 30-day window)",
    )
    args = parser.parse_args()
    result = run_fb_campaign(
        schedule_future=not args.no_schedule,
        dry_run=args.dry_run,
        page_id=args.page_id,
        max_posts=args.max_posts,
    )
    print(json.dumps(result, indent=2, ensure_ascii=False))
    raise SystemExit(0 if result["ok"] else 1)
