#!/usr/bin/env python3
"""Remove same-day published duplicates and re-queue one Facebook post per day."""

from __future__ import annotations

import json
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

import requests

from meta_client import GRAPH_BASE, MetaBusinessError, _graph_delete, _resolve_page
from fb_campaign_scheduler import STATE_FILE, run_fb_campaign

IST = timezone(timedelta(hours=5, minutes=30))
DELETE_GAP_SEC = 2


def _list_published(page: dict, *, day_prefix: str) -> list[dict]:
    token = page["page_access_token"]
    pid = page["page_id"]
    rows: list[dict] = []
    url = f"{GRAPH_BASE}/{pid}/published_posts"
    params = {
        "access_token": token,
        "fields": "id,created_time",
        "limit": 100,
    }
    while url:
        response = requests.get(url, params=params, timeout=60)
        data = response.json()
        if "error" in data:
            raise MetaBusinessError(data["error"].get("message", str(data["error"])))
        for row in data.get("data", []):
            if row.get("created_time", "").startswith(day_prefix):
                rows.append(row)
        paging = data.get("paging", {})
        url = paging.get("next")
        params = {}
    return rows


def _list_scheduled(page: dict) -> list[dict]:
    token = page["page_access_token"]
    pid = page["page_id"]
    rows: list[dict] = []
    url = f"{GRAPH_BASE}/{pid}/scheduled_posts"
    params = {
        "access_token": token,
        "fields": "id,scheduled_publish_time",
        "limit": 100,
    }
    while url:
        response = requests.get(url, params=params, timeout=60)
        data = response.json()
        if "error" in data:
            raise MetaBusinessError(data["error"].get("message", str(data["error"])))
        rows.extend(data.get("data", []))
        paging = data.get("paging", {})
        url = paging.get("next")
        params = {}
    return rows


def _delete_posts(page: dict, post_ids: list[str], *, label: str) -> dict:
    token = page["page_access_token"]
    deleted: list[str] = []
    errors: list[dict] = []
    for index, post_id in enumerate(post_ids, start=1):
        try:
            _graph_delete(f"/{post_id}", {"access_token": token})
            deleted.append(post_id)
            print(f"[delete {label}] {index}/{len(post_ids)} {post_id}", file=sys.stderr)
        except MetaBusinessError as exc:
            errors.append({"id": post_id, "error": str(exc)})
        if index < len(post_ids):
            time.sleep(DELETE_GAP_SEC)
    return {"deleted": deleted, "errors": errors}


def main() -> int:
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--page-id", default="")
    parser.add_argument(
        "--published-day",
        default=datetime.now(tz=IST).date().isoformat(),
        help="Delete published posts on this IST date (YYYY-MM-DD)",
    )
    parser.add_argument("--skip-delete", action="store_true")
    parser.add_argument("--skip-reschedule", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    page = _resolve_page(args.page_id)
    today = args.published_day

    published = _list_published(page, day_prefix=today)
    scheduled = _list_scheduled(page)
    print(
        json.dumps(
            {
                "published_on_day": len(published),
                "scheduled_total": len(scheduled),
                "day": today,
            },
            indent=2,
        ),
        file=sys.stderr,
    )

    result: dict = {"published_on_day": today, "deleted": {}, "reschedule": {}}

    if not args.skip_delete:
        pub_ids = [row["id"] for row in published]
        sched_ids = [row["id"] for row in scheduled]
        if args.dry_run:
            result["deleted"] = {
                "dry_run": True,
                "published": pub_ids,
                "scheduled": sched_ids,
            }
        else:
            result["deleted"]["published"] = _delete_posts(
                page, pub_ids, label="published"
            )
            if sched_ids:
                time.sleep(DELETE_GAP_SEC)
                result["deleted"]["scheduled"] = _delete_posts(
                    page, sched_ids, label="scheduled"
                )
            STATE_FILE.write_text(
                json.dumps({"published": {}, "scheduled": {}}, indent=2),
                encoding="utf-8",
            )

    if not args.skip_reschedule:
        if args.dry_run:
            result["reschedule"] = run_fb_campaign(
                dry_run=True,
                page_id=args.page_id,
            )
        else:
            result["reschedule"] = run_fb_campaign(
                dry_run=False,
                page_id=args.page_id,
            )

    print(json.dumps(result, indent=2, ensure_ascii=False))
    deleted_pub_errors = result.get("deleted", {}).get("published", {})
    if isinstance(deleted_pub_errors, dict):
        delete_failed = bool(deleted_pub_errors.get("errors"))
    else:
        delete_failed = False
    ok = not result.get("reschedule", {}).get("errors") and not delete_failed
    return 0 if ok or args.dry_run else 1


if __name__ == "__main__":
    raise SystemExit(main())
