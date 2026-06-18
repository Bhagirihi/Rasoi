#!/usr/bin/env python3
"""AdMob MCP server for Rasoi — list apps/ad units and pull earnings reports."""

from __future__ import annotations

import argparse
import json
import sys

from mcp.server.fastmcp import FastMCP

from admob_client import (
    AdMobError,
    auth_status,
    generate_network_report,
    get_account,
    list_ad_units,
    list_apps,
    rasoi_codebase_config,
    run_oauth_flow,
)

mcp = FastMCP('admob')


def _json(data: object) -> str:
    return json.dumps(data, indent=2, ensure_ascii=False)


@mcp.tool()
def admob_auth_status() -> str:
    """Check OAuth setup, publisher code, and Rasoi app ID env vars."""
    return _json(auth_status())


@mcp.tool()
def admob_get_account() -> str:
    """Get AdMob publisher account info (timezone, currency)."""
    try:
        return _json(get_account())
    except AdMobError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def admob_list_apps() -> str:
    """List all apps registered in your AdMob account."""
    try:
        return _json(list_apps())
    except AdMobError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def admob_list_ad_units(app_id: str = '') -> str:
    """List banner/interstitial ad units. Optional app_id filter (e.g. ca-app-pub-…~…)."""
    try:
        return _json(list_ad_units(app_id=app_id))
    except AdMobError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def admob_network_report(
    date_start: str,
    date_end: str,
    metrics: str = 'IMPRESSIONS,CLICKS,ESTIMATED_EARNINGS',
    dimensions: str = 'DATE',
) -> str:
    """Generate an AdMob network earnings report. Dates: YYYY-MM-DD."""
    try:
        metric_list = [m.strip() for m in metrics.split(',') if m.strip()]
        dim_list = [d.strip() for d in dimensions.split(',') if d.strip()] or None
        return _json(
            generate_network_report(
                date_start=date_start,
                date_end=date_end,
                metrics=metric_list,
                dimensions=dim_list,
            ),
        )
    except AdMobError as exc:
        return _json({'error': str(exc)})
    except (ValueError, TypeError) as exc:
        return _json({'error': f'Invalid date or params: {exc}'})


@mcp.tool()
def admob_rasoi_config() -> str:
    """Show Rasoi mobile AdMob file paths and env-configured app IDs (no secrets)."""
    status = auth_status()
    codebase = rasoi_codebase_config()
    return _json({'auth': status, 'codebase': codebase})


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--auth', action='store_true', help='Run Google OAuth flow once')
    args = parser.parse_args()

    if args.auth:
        try:
            result = run_oauth_flow()
            print(_json(result))
        except AdMobError as exc:
            print(_json({'error': str(exc)}), file=sys.stderr)
            sys.exit(1)
        return

    mcp.run()


if __name__ == '__main__':
    main()
