#!/usr/bin/env python3
"""Upload Rasoi Play Store phone screenshots from docs/marketing/app-store-screenshots/."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MCP = ROOT / '.cursor' / 'mcp-servers' / 'google-play'
sys.path.insert(0, str(MCP))

from play_client import PlayError, push_store_screenshots  # noqa: E402

SCREENSHOT_DIR = ROOT / 'docs' / 'marketing' / 'app-store-screenshots' / 'play-store-upload'
ORDER = [
    '01-01-hook-never-wonder-what-to-cook.png',
    '02-02-problem-confused-about-dinner.png',
    '03-03-feature-cook-with-ingredients.png',
    '04-04-feature-regional-recipes.png',
    '05-05-feature-fits-today.png',
    '06-06-social-proof-home-cooks.png',
    '07-07-lifestyle-family-time.png',
    '08-08-cta-download-today.png',
]


def main() -> int:
    paths = [SCREENSHOT_DIR / name for name in ORDER]
    missing = [str(p) for p in paths if not p.exists()]
    if missing:
        print(json.dumps({'error': 'Missing files', 'paths': missing}, indent=2))
        return 1

    try:
        result = push_store_screenshots(screenshot_paths=[str(p) for p in paths])
        print(json.dumps(result, indent=2, ensure_ascii=False))
        return 0
    except PlayError as exc:
        print(json.dumps({'error': str(exc)}, indent=2))
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
