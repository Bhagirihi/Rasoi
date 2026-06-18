"""Google AdMob API client for Rasoi MCP."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = [
    'https://www.googleapis.com/auth/admob.readonly',
    'https://www.googleapis.com/auth/admob.report',
]

ROOT = Path(__file__).resolve().parent
CREDENTIALS_DIR = ROOT / 'credentials'
CLIENT_SECRET_PATH = CREDENTIALS_DIR / 'client_secret.json'
TOKEN_PATH = CREDENTIALS_DIR / 'token.json'
OAUTH_REDIRECT_PORT = 8765


class AdMobError(Exception):
    pass


def publisher_code() -> str:
    code = os.environ.get('PUBLISHER_CODE', '').strip()
    if not code:
        raise AdMobError('Set PUBLISHER_CODE in .cursor/mcp-servers/admob/.env')
    if not code.startswith('pub-'):
        code = f'pub-{code}'
    return code


def account_name() -> str:
    return f'accounts/{publisher_code()}'


def _load_credentials() -> Credentials | None:
    if not TOKEN_PATH.exists():
        return None
    creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)
    if creds.valid:
        return creds
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        TOKEN_PATH.write_text(creds.to_json())
        return creds
    return None


def google_account_email() -> str:
    return os.environ.get('GOOGLE_ACCOUNT_EMAIL', '').strip() or 'my.website.email2@gmail.com'


def auth_status() -> dict[str, Any]:
    has_secret = CLIENT_SECRET_PATH.exists()
    has_token = TOKEN_PATH.exists()
    creds = _load_credentials() if has_token else None
    return {
        'client_secret_configured': has_secret,
        'token_configured': has_token,
        'authenticated': creds is not None and creds.valid,
        'google_account_email': google_account_email(),
        'publisher_code': os.environ.get('PUBLISHER_CODE', '').strip() or None,
        'rasoi_android_app_id': os.environ.get('RASOI_ADMOB_ANDROID_APP_ID', '').strip() or None,
        'credentials_dir': str(CREDENTIALS_DIR),
    }


def run_oauth_flow() -> dict[str, Any]:
    if not CLIENT_SECRET_PATH.exists():
        raise AdMobError(
            f'Download OAuth Desktop client JSON from Google Cloud Console and save as {CLIENT_SECRET_PATH}',
        )

    CREDENTIALS_DIR.mkdir(parents=True, exist_ok=True)
    email = google_account_email()
    print(f'AdMob OAuth: sign in as {email} in the browser window.', file=sys.stderr)
    flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRET_PATH), SCOPES)
    creds = flow.run_local_server(port=OAUTH_REDIRECT_PORT, open_browser=True, login_hint=email)
    TOKEN_PATH.write_text(creds.to_json())
    return {'ok': True, 'token_path': str(TOKEN_PATH)}


def get_service():
    creds = _load_credentials()
    if not creds:
        raise AdMobError(
            'Not authenticated. Run: .cursor/mcp-servers/admob/run.sh auth',
        )

    from googleapiclient.discovery import build

    return build('admob', 'v1', credentials=creds, cache_discovery=False)


def get_account() -> dict[str, Any]:
    service = get_service()
    data = service.accounts().get(name=account_name()).execute()
    return {
        'name': data.get('name'),
        'publisherId': data.get('publisherId'),
        'reportingTimeZone': data.get('reportingTimeZone'),
        'currencyCode': data.get('currencyCode'),
    }


def list_apps() -> list[dict[str, Any]]:
    service = get_service()
    apps: list[dict[str, Any]] = []
    page_token: str | None = None
    while True:
        request = service.accounts().apps().list(parent=account_name(), pageToken=page_token)
        data = request.execute()
        apps.extend(data.get('apps', []))
        page_token = data.get('nextPageToken')
        if not page_token:
            break
    return apps


def list_ad_units(app_id: str = '') -> list[dict[str, Any]]:
    service = get_service()
    units: list[dict[str, Any]] = []
    page_token: str | None = None
    while True:
        request = service.accounts().adUnits().list(parent=account_name(), pageToken=page_token)
        data = request.execute()
        units.extend(data.get('adUnits', []))
        page_token = data.get('nextPageToken')
        if not page_token:
            break
    if app_id.strip():
        needle = app_id.strip()
        units = [u for u in units if needle in (u.get('appId') or '') or needle in (u.get('name') or '')]
    return units


def generate_network_report(
    date_start: str,
    date_end: str,
    metrics: list[str] | None = None,
    dimensions: list[str] | None = None,
) -> list[dict[str, Any]]:
    service = get_service()
    sy, sm, sd = [int(x) for x in date_start.split('-')]
    ey, em, ed = [int(x) for x in date_end.split('-')]
    report_spec: dict[str, Any] = {
        'dateRange': {
            'startDate': {'year': sy, 'month': sm, 'day': sd},
            'endDate': {'year': ey, 'month': em, 'day': ed},
        },
        'metrics': metrics or ['IMPRESSIONS', 'CLICKS', 'ESTIMATED_EARNINGS'],
    }
    if dimensions:
        report_spec['dimensions'] = dimensions

    request = service.accounts().networkReport().generate(
        parent=account_name(),
        body={'reportSpec': report_spec},
    )
    rows: list[dict[str, Any]] = []
    for chunk in request.execute():
        if 'row' in chunk:
            rows.append(chunk['row'])
        if 'footer' in chunk:
            rows.append({'footer': chunk['footer']})
    return rows


def rasoi_codebase_config() -> dict[str, Any]:
    repo_root = ROOT.parents[2]
    app_json = repo_root / 'rasoi_mobile' / 'app.json'
    banner_ts = repo_root / 'rasoi_mobile' / 'components' / 'AdMobBanner.tsx'
    manifest = repo_root / 'rasoi_mobile' / 'android' / 'app' / 'src' / 'main' / 'AndroidManifest.xml'

    config: dict[str, Any] = {
        'env_android_app_id': os.environ.get('RASOI_ADMOB_ANDROID_APP_ID', '').strip() or None,
        'files': {},
    }
    for label, path in [
        ('app_json', app_json),
        ('admob_banner', banner_ts),
        ('android_manifest', manifest),
    ]:
        if path.exists():
            config['files'][label] = str(path.relative_to(repo_root))
        else:
            config['files'][label] = None
    return config
