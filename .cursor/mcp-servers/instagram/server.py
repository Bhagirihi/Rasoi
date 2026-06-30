#!/usr/bin/env python3
"""Instagram MCP server for Rasoi marketing posts (username/password login)."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from mcp.server.fastmcp import FastMCP

from instagram_client import InstagramClient, InstagramError
from scheduler import (
    add_custom_post,
    campaign_overview,
    get_campaign_post,
    get_due_campaign_posts,
    get_due_custom_posts,
    get_published_campaign_posts,
    list_custom_posts,
    mark_campaign_media_id,
    mark_campaign_published,
    mark_custom_published,
    resolve_repo_path,
)

mcp = FastMCP("instagram-scheduler")


def _client() -> InstagramClient:
    return InstagramClient()


def _json(data: object) -> str:
    return json.dumps(data, indent=2, ensure_ascii=False)


@mcp.tool()
def instagram_account_status() -> str:
    """Check Instagram login and return connected account details."""
    try:
        return _json(_client().account_info())
    except InstagramError as exc:
        return _json({"error": str(exc)})


@mcp.tool()
def instagram_publish_photo(
    caption: str,
    image_path: str = "",
    image_url: str = "",
) -> str:
    """Publish a photo to Instagram now. Provide image_path (repo-relative or absolute). image_url is not supported with password login."""
    if image_url.strip():
        return _json({"error": "image_url is not supported. Use image_path to a local file."})
    if not image_path.strip():
        return _json({"error": "Provide image_path."})
    try:
        path = resolve_repo_path(image_path.strip())
        result = _client().publish_photo(path, caption)
        return _json({"ok": True, **result})
    except (InstagramError, FileNotFoundError) as exc:
        return _json({"error": str(exc)})


@mcp.tool()
def instagram_campaign_overview(limit: int = 20, include_published: bool = True) -> str:
    """List Rasoi ad campaign posts with schedule and publish status."""
    return _json(campaign_overview(limit=limit, include_published=include_published))


@mcp.tool()
def instagram_publish_campaign_post(post_id: int, dry_run: bool = False) -> str:
    """Publish one campaign post to Instagram by id (1-59). Set dry_run=true to preview only."""
    try:
        row = get_campaign_post(post_id)
        if row["published"]:
            return _json({"error": f"Post {post_id} already published", "url": row.get("url")})
        preview = {
            "id": row["id"],
            "headline": row["headline"],
            "image_path": row["image_path"],
            "caption_preview": row["caption"][:280] + "...",
        }
        if dry_run:
            return _json({"dry_run": True, **preview})
        path = resolve_repo_path(row["image_path"])
        result = _client().publish_photo(path, row["caption"])
        mark_campaign_published(post_id, result)
        return _json({"ok": True, **preview, **result})
    except (InstagramError, FileNotFoundError, KeyError) as exc:
        return _json({"error": str(exc)})


@mcp.tool()
def instagram_publish_due_campaign_posts(dry_run: bool = False, max_posts: int = 1) -> str:
    """Publish all due campaign posts to Instagram. Use max_posts to limit batch size."""
    due = get_due_campaign_posts()[: max(1, max_posts)]
    if not due:
        return _json({"ok": True, "published": [], "message": "No due campaign posts."})
    if dry_run:
        return _json({"dry_run": True, "due": [{"id": row["id"], "headline": row["headline"]} for row in due]})

    published: list[dict] = []
    errors: list[dict] = []
    client = _client()
    for row in due:
        try:
            path = resolve_repo_path(row["image_path"])
            result = client.publish_photo(path, row["caption"])
            mark_campaign_published(row["id"], result)
            published.append({"id": row["id"], **result})
        except (InstagramError, FileNotFoundError) as exc:
            errors.append({"id": row["id"], "error": str(exc)})
            break
    return _json({"ok": not errors, "published": published, "errors": errors})


@mcp.tool()
def instagram_schedule_custom_post(
    image_path: str,
    caption: str,
    scheduled_at: str,
) -> str:
    """Queue a one-off Instagram post. scheduled_at must be ISO datetime, e.g. 2026-06-17T10:00:00+05:30."""
    try:
        resolve_repo_path(image_path)
        row = add_custom_post(image_path, caption, scheduled_at)
        return _json({"ok": True, **row})
    except (FileNotFoundError, ValueError) as exc:
        return _json({"error": str(exc)})


@mcp.tool()
def instagram_list_custom_schedule(include_published: bool = True) -> str:
    """List one-off scheduled posts in the local queue."""
    return _json(list_custom_posts(include_published=include_published))


@mcp.tool()
def instagram_edit_campaign_caption(post_id: int, dry_run: bool = False) -> str:
    """Update the caption on an already-published campaign post (in-place edit, no repost)."""
    try:
        row = get_campaign_post(post_id)
        if not row["published"]:
            return _json({"error": f"Post {post_id} is not published yet"})
        preview = {
            "id": row["id"],
            "headline": row["headline"],
            "url": row.get("url"),
            "caption_preview": row["caption"][:400] + "...",
        }
        if dry_run:
            return _json({"dry_run": True, **preview})

        client = _client()
        media_id = row.get("media_id")
        if not media_id and row.get("url"):
            media_id = client.media_id_from_url(row["url"])
            mark_campaign_media_id(post_id, media_id)

        if not media_id:
            return _json({"error": f"Post {post_id} has no media_id or url to resolve it"})

        result = client.edit_caption(media_id, row["caption"])
        return _json({"ok": True, **preview, **result})
    except (InstagramError, KeyError) as exc:
        return _json({"error": str(exc)})


@mcp.tool()
def instagram_refresh_published_captions(
    dry_run: bool = False,
    max_posts: int = 20,
    post_ids: str = "",
) -> str:
    """Refresh captions on all published campaign posts with the latest template. Comma-separated post_ids optional."""
    try:
        rows = get_published_campaign_posts()
        if post_ids.strip():
            wanted = {int(part.strip()) for part in post_ids.split(",") if part.strip()}
            rows = [row for row in rows if row["id"] in wanted]
        rows = rows[: max(1, max_posts)]

        if not rows:
            return _json({"ok": True, "updated": [], "message": "No published posts to update."})

        if dry_run:
            return _json(
                {
                    "dry_run": True,
                    "posts": [
                        {
                            "id": row["id"],
                            "url": row.get("url"),
                            "headline": row["headline"],
                            "caption_preview": row["caption"][:200] + "...",
                        }
                        for row in rows
                    ],
                }
            )

        client = _client()
        updated: list[dict] = []
        errors: list[dict] = []
        for row in rows:
            try:
                media_id = row.get("media_id")
                if not media_id and row.get("url"):
                    media_id = client.media_id_from_url(row["url"])
                    mark_campaign_media_id(row["id"], media_id)
                if not media_id:
                    raise InstagramError("missing media_id and url")
                client.edit_caption(media_id, row["caption"])
                updated.append({"id": row["id"], "url": row.get("url"), "media_id": media_id})
            except InstagramError as exc:
                errors.append({"id": row["id"], "error": str(exc)})
        return _json({"ok": not errors, "updated": updated, "errors": errors})
    except (InstagramError, ValueError) as exc:
        return _json({"error": str(exc)})


@mcp.tool()
def instagram_publish_due_custom_posts(dry_run: bool = False, max_posts: int = 1) -> str:
    """Publish due one-off scheduled posts from the custom queue."""
    due = get_due_custom_posts()[: max(1, max_posts)]
    if not due:
        return _json({"ok": True, "published": [], "message": "No due custom posts."})
    if dry_run:
        return _json({"dry_run": True, "due": due})

    published: list[dict] = []
    errors: list[dict] = []
    client = _client()
    for row in due:
        try:
            path = resolve_repo_path(row["image_path"])
            result = client.publish_photo(path, row["caption"])
            mark_custom_published(row["id"], result)
            published.append({"id": row["id"], **result})
        except (InstagramError, FileNotFoundError) as exc:
            errors.append({"id": row["id"], "error": str(exc)})
            break
    return _json({"ok": not errors, "published": published, "errors": errors})


def _run_due_from_cli(dry_run: bool, max_posts: int) -> int:
    due_campaign = get_due_campaign_posts()[:max_posts]
    if not due_campaign:
        print("No due campaign posts.")
        return 0

    client = InstagramClient()
    for row in due_campaign:
        if dry_run:
            print(f"[dry-run] Would publish campaign post {row['id']}: {row['headline']}")
            continue
        path = resolve_repo_path(row["image_path"])
        result = client.publish_photo(path, row["caption"])
        mark_campaign_published(row["id"], result)
        print(f"Published campaign post {row['id']} -> {result.get('url')}")
    return 0


if __name__ == "__main__":
    if "--run-due" in sys.argv:
        parser = argparse.ArgumentParser()
        parser.add_argument("--run-due", action="store_true")
        parser.add_argument("--dry-run", action="store_true")
        parser.add_argument("--max-posts", type=int, default=1)
        args = parser.parse_args()
        raise SystemExit(_run_due_from_cli(args.dry_run, args.max_posts))

    mcp.run()
