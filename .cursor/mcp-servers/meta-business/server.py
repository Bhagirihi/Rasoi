#!/usr/bin/env python3
"""Meta Business MCP — schedule Facebook + Instagram posts via Graph API."""

from __future__ import annotations

import argparse
import json
import os
import sys

from mcp.server.fastmcp import FastMCP

from meta_client import (
    MetaBusinessError,
    auth_status,
    list_connected_accounts,
    list_facebook_scheduled_posts,
    publish_facebook_now,
    publish_instagram_photo,
    run_oauth_flow,
    schedule_facebook_post,
    schedule_instagram_photo,
)
from scheduler import list_local_posts, run_due_posts

mcp = FastMCP("meta-business")


def _json(data: object) -> str:
    return json.dumps(data, indent=2, ensure_ascii=False)


@mcp.tool()
def meta_auth_status() -> str:
    """Check Meta app credentials, OAuth token, and default page/IG IDs."""
    return _json(auth_status())


@mcp.tool()
def meta_list_connected_accounts() -> str:
    """List Facebook Pages and linked Instagram Business accounts (Business Suite assets)."""
    try:
        return _json(list_connected_accounts())
    except MetaBusinessError as exc:
        return _json({"error": str(exc)})


@mcp.tool()
def meta_schedule_facebook_post(
    message: str,
    scheduled_at: str,
    page_id: str = "",
    image_url: str = "",
    link: str = "",
) -> str:
    """Schedule a Facebook Page post (10 min – 30 days ahead). scheduled_at: ISO 8601 or Unix seconds."""
    try:
        return _json(
            schedule_facebook_post(
                message=message,
                scheduled_at=scheduled_at,
                page_id=page_id,
                image_url=image_url,
                link=link,
            )
        )
    except MetaBusinessError as exc:
        return _json({"error": str(exc)})


@mcp.tool()
def meta_publish_facebook_now(
    message: str,
    page_id: str = "",
    image_url: str = "",
    link: str = "",
) -> str:
    """Publish a Facebook Page post immediately."""
    try:
        return _json(
            publish_facebook_now(
                message=message,
                page_id=page_id,
                image_url=image_url,
                link=link,
            )
        )
    except MetaBusinessError as exc:
        return _json({"error": str(exc)})


@mcp.tool()
def meta_list_facebook_scheduled(page_id: str = "", limit: int = 20) -> str:
    """List scheduled Facebook Page posts from Meta (same queue Business Suite uses)."""
    try:
        return _json(list_facebook_scheduled_posts(page_id=page_id, limit=limit))
    except MetaBusinessError as exc:
        return _json({"error": str(exc)})


@mcp.tool()
def meta_publish_instagram_now(
    caption: str,
    image_url: str,
    ig_user_id: str = "",
    page_id: str = "",
) -> str:
    """Publish an Instagram feed photo now. image_url must be publicly reachable (HTTPS)."""
    try:
        return _json(
            publish_instagram_photo(
                caption=caption,
                image_url=image_url,
                ig_user_id=ig_user_id,
                page_id=page_id,
            )
        )
    except MetaBusinessError as exc:
        return _json({"error": str(exc)})


@mcp.tool()
def meta_schedule_instagram_post(
    caption: str,
    image_url: str,
    scheduled_at: str,
    ig_user_id: str = "",
    page_id: str = "",
) -> str:
    """Schedule an Instagram feed photo. Uses Meta native scheduling when supported, else local queue."""
    try:
        return _json(
            schedule_instagram_photo(
                caption=caption,
                image_url=image_url,
                scheduled_at=scheduled_at,
                ig_user_id=ig_user_id,
                page_id=page_id,
            )
        )
    except MetaBusinessError as exc:
        return _json({"error": str(exc)})


@mcp.tool()
def meta_list_local_scheduled(include_published: bool = False, limit: int = 50) -> str:
    """List posts queued locally (Instagram fallback when native scheduling is unavailable)."""
    return _json({"posts": list_local_posts(include_published=include_published, limit=limit)})


@mcp.tool()
def meta_run_due_scheduled_posts(dry_run: bool = False) -> str:
    """Publish due locally queued Instagram posts. Use dry_run=true to preview."""
    return _json({"results": run_due_posts(dry_run=dry_run)})


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--auth", action="store_true", help="Run Meta OAuth flow once")
    parser.add_argument("--run-due", action="store_true", help="Publish due locally queued posts")
    parser.add_argument("--dry-run", action="store_true", help="With --run-due, preview only")
    args = parser.parse_args()

    if args.auth:
        try:
            no_browser = os.environ.get("META_OAUTH_NO_BROWSER", "").strip() in ("1", "true", "yes")
            print(_json(run_oauth_flow(open_browser=not no_browser)))
        except MetaBusinessError as exc:
            print(_json({"error": str(exc)}))
            sys.exit(1)
        return

    if args.run_due:
        print(_json({"results": run_due_posts(dry_run=args.dry_run)}))
        return

    mcp.run()


if __name__ == "__main__":
    main()
