#!/usr/bin/env python3
"""Google Play Console MCP server for Rasoi — subscriptions, catalog, setup guidance."""

from __future__ import annotations

import argparse
import json
import sys

from mcp.server.fastmcp import FastMCP

from play_client import (
    PlayError,
    activate_base_plan,
    auth_status,
    convert_region_prices,
    create_rasoi_subscriptions,
    create_subscription,
    full_rasoi_setup,
    get_subscription,
    get_track_releases,
    list_subscriptions,
    load_manifest,
    package_name,
    push_aso_bundle,
    push_store_graphics,
    push_store_listing,
    rasoi_codebase_config,
    upload_and_rollout_open_testing,
    rollout_rasoi_open_testing,
    rollout_rasoi_production,
    rollout_release,
    run_oauth_flow,
    setup_guide,
    verify_app,
)

mcp = FastMCP('google-play')


def _json(data: object) -> str:
    return json.dumps(data, indent=2, ensure_ascii=False)


@mcp.tool()
def play_auth_status() -> str:
    """Check service account / OAuth setup and Rasoi package name."""
    return _json(auth_status())


@mcp.tool()
def play_setup_guide() -> str:
    """How to create the Play app manually and wire API access for subscriptions."""
    return _json(setup_guide())


@mcp.tool()
def play_verify_app(package_name: str = '') -> str:
    """Verify an app exists in Play Console and the API can reach it (lists subscriptions)."""
    try:
        return _json(verify_app(package_name or None))
    except PlayError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def play_list_subscriptions(package_name: str = '') -> str:
    """List all subscription products for the Rasoi app."""
    try:
        return _json(list_subscriptions(package_name or None))
    except PlayError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def play_get_subscription(product_id: str, package_name: str = '') -> str:
    """Get one subscription by product id (e.g. rasoi_plus_monthly)."""
    try:
        return _json(get_subscription(product_id, package_name or None))
    except PlayError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def play_create_subscription(
    product_id: str,
    title: str,
    description: str,
    base_plan_id: str,
    billing_period: str,
    price_inr: float,
    activate: bool = True,
    package_name: str = '',
) -> str:
    """Create a Play subscription with one auto-renewing base plan. billing_period: P1M, P1Y, etc."""
    try:
        return _json(
            create_subscription(
                product_id=product_id,
                title=title,
                description=description,
                base_plan_id=base_plan_id,
                billing_period=billing_period,
                price_inr=price_inr,
                pkg=package_name or None,
                activate=activate,
            ),
        )
    except PlayError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def play_activate_base_plan(
    product_id: str,
    base_plan_id: str,
    package_name: str = '',
) -> str:
    """Activate a draft base plan so new subscribers can purchase it."""
    try:
        return _json(activate_base_plan(product_id, base_plan_id, package_name or None))
    except PlayError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def play_create_rasoi_subscriptions(activate: bool = True, package_name: str = '') -> str:
    """Create Rasoi Plus monthly (₹49) and yearly (₹499) subscriptions if missing; optionally activate."""
    try:
        return _json(create_rasoi_subscriptions(activate=activate, pkg=package_name or None))
    except PlayError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def play_convert_region_prices(price_inr: float, package_name: str = '') -> str:
    """Convert an INR price to regional Play prices using today's exchange rates."""
    try:
        return _json(convert_region_prices(price_inr, package_name or None))
    except PlayError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def play_get_manifest() -> str:
    """Load Rasoi Play Console manifest (listing copy, subscriptions, declarations)."""
    try:
        return _json(load_manifest())
    except PlayError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def play_push_listing(package_name: str = '', language: str = 'all') -> str:
    """Push store title + descriptions from manifest.json via Play edits API. Use language=all for en-US + localizedListings."""
    try:
        return _json(push_store_listing(pkg=package_name or None, language=language))
    except PlayError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def play_push_graphics(package_name: str = '', language: str = 'en-US', replace_existing: bool = True) -> str:
    """Upload feature graphic + phone screenshots from manifest.assets to Play Store listing."""
    try:
        return _json(
            push_store_graphics(
                pkg=package_name or None,
                language=language or None,
                replace_existing=replace_existing,
            ),
        )
    except PlayError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def play_push_aso(package_name: str = '', include_graphics: bool = True) -> str:
    """Push full ASO bundle: all listing locales (skip unsupported) + feature graphic + screenshots."""
    try:
        return _json(push_aso_bundle(pkg=package_name or None, include_graphics=include_graphics))
    except PlayError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def play_full_setup(package_name: str = '', activate_subscriptions: bool = True) -> str:
    """After app exists in Play Console: verify, push listing, create Rasoi Plus subscriptions."""
    try:
        return _json(full_rasoi_setup(pkg=package_name or None, activate_subscriptions=activate_subscriptions))
    except PlayError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def play_rasoi_config() -> str:
    """Show Rasoi package name, product ids, and related codebase paths."""
    return _json({'package_name': package_name(), 'codebase': rasoi_codebase_config()})


@mcp.tool()
def play_get_tracks(package_name: str = '') -> str:
    """Read current releases on internal, closed (alpha), open (beta), and production tracks."""
    try:
        return _json(get_track_releases(pkg=package_name or None))
    except PlayError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def play_rollout_release(
    track: str,
    version_code: int,
    version_name: str = '',
    status: str = 'completed',
    package_name: str = '',
) -> str:
    """Roll out an uploaded bundle (versionCode) to a Play track. track: internal, alpha, beta, production."""
    try:
        return _json(
            rollout_release(
                track=track,
                version_code=version_code,
                status=status,
                name=version_name,
                pkg=package_name or None,
            ),
        )
    except PlayError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def play_rollout_rasoi_open_testing(
    version_code: int = 11,
    version_name: str = '1.0.10',
    package_name: str = '',
) -> str:
    """Roll out an already-uploaded bundle to Open testing (beta) with all release-note locales from manifest JSON."""
    try:
        return _json(
            rollout_rasoi_open_testing(
                version_code=version_code,
                version_name=version_name,
                pkg=package_name or None,
            ),
        )
    except PlayError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def play_upload_and_rollout_open_testing(
    aab_path: str,
    version_name: str = '1.0.10',
    package_name: str = '',
) -> str:
    """Upload AAB to Play, then roll out to Open testing (beta) with all localized release notes."""
    try:
        return _json(
            upload_and_rollout_open_testing(
                aab_path=aab_path,
                version_name=version_name,
                pkg=package_name or None,
            ),
        )
    except PlayError as exc:
        return _json({'error': str(exc)})


@mcp.tool()
def play_rollout_rasoi_production(version_code: int = 9, version_name: str = '1.0.8', package_name: str = '') -> str:
    """Roll out Rasoi to Production (public Play Store) with en-US + hi-IN release notes."""
    try:
        return _json(
            rollout_rasoi_production(
                version_code=version_code,
                version_name=version_name,
                pkg=package_name or None,
            ),
        )
    except PlayError as exc:
        return _json({'error': str(exc)})


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--auth', action='store_true', help='Run Google OAuth flow (oauth mode only)')
    args = parser.parse_args()

    if args.auth:
        try:
            result = run_oauth_flow()
            print(_json(result))
        except PlayError as exc:
            print(_json({'error': str(exc)}), file=sys.stderr)
            sys.exit(1)
        return

    mcp.run()


if __name__ == '__main__':
    main()
