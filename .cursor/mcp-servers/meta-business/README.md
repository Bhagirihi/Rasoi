# Meta Business MCP

Official [Meta Graph API](https://developers.facebook.com/docs/graph-api/) integration for Rasoi — schedule and publish **Facebook Page** and **Instagram Business** posts from Cursor.

This uses the **same API backend as [Meta Business Suite](https://business.facebook.com/)** (posting, scheduling, linked IG + Page). Meta does **not** expose a separate “Business Suite API”; Business Suite is the UI on top of Graph API.

Rasoi Instagram: `@rasoi_app` (must be a Professional account linked to your Facebook Page).

## vs existing Instagram MCP

| | **meta-business** (this) | **instagram** (instagrapi) |
|--|---------------------------|----------------------------|
| Auth | Official Meta OAuth | Username/password |
| Facebook Page | Yes | No |
| FB native scheduling | Yes | No |
| IG scheduling | Native when supported; else local queue | Local campaign scheduler |
| Stability | Official API | Unofficial — can break |
| Images | Public HTTPS URL required | Local file path OK |

You can use **both**: keep instagrapi for bulk local-image campaigns; use this MCP for Business Suite–style FB + IG scheduling.

## One-time setup

### 1. Meta Developer app

1. Go to [developers.facebook.com](https://developers.facebook.com/) → **Create app** → type **Business**.
2. Add products: **Facebook Login** and **Instagram Graph API**.
3. **Settings → Basic** → copy **App ID** and **App Secret**.
4. **Facebook Login → Settings** → add Valid OAuth Redirect URI:
   ```
   http://localhost:8766/callback
   ```
5. Link `@rasoi_app` to your Rasoi Facebook Page in [Business Suite](https://business.facebook.com/) if not already.

### 2. Env + OAuth

```bash
cp .cursor/mcp-servers/meta-business/.env.example .cursor/mcp-servers/meta-business/.env
# Edit .env: META_APP_ID, META_APP_SECRET, META_ACCOUNT_EMAIL

chmod +x .cursor/mcp-servers/meta-business/run.sh
.cursor/mcp-servers/meta-business/run.sh auth
```

Sign in with the Meta account that administers the Page and Instagram.

### 3. Reload MCP in Cursor

Settings → Tools & MCP → refresh.

### 4. Discover IDs

Run `meta_list_connected_accounts` and optionally set `META_PAGE_ID` / `META_IG_USER_ID` in `.env`.

## MCP tools

| Tool | Purpose |
|------|---------|
| `meta_auth_status` | Credentials + token health |
| `meta_list_connected_accounts` | Pages + linked Instagram accounts |
| `meta_schedule_facebook_post` | Schedule FB post (10 min – 30 days) |
| `meta_publish_facebook_now` | Publish FB post now |
| `meta_list_facebook_scheduled` | List queued FB posts in Meta |
| `meta_publish_instagram_now` | Publish IG photo (public image URL) |
| `meta_schedule_instagram_post` | Schedule IG photo |
| `meta_list_local_scheduled` | Local IG queue (fallback) |
| `meta_run_due_scheduled_posts` | Publish due local queue |

## Scheduling notes

- **Facebook**: native scheduling via [Pages API](https://developers.facebook.com/docs/pages-api/posts/) — same queue Business Suite shows.
- **Instagram**: tries native `scheduled_publish_time` on the media container; if unsupported, queues locally in `local-schedule.json`. Run due posts:
  ```bash
  .cursor/mcp-servers/meta-business/run.sh run-due
  ```
  Or use `meta_run_due_scheduled_posts` from Cursor. Add a cron/GitHub Action like the instagram MCP if needed.

## Image URLs

Instagram Graph API requires **public HTTPS image URLs** (e.g. `https://rasoiapplication.in/...`). Local files are not supported — use the **instagram** MCP for local `docs/marketing/ad-images/` paths.

## App Review (later)

For accounts beyond app admins/testers, Meta may require [App Review](https://developers.facebook.com/docs/app-review/) for `pages_manage_posts` and `instagram_content_publish`. Until then, only users with a role on the Developer app can publish.

## Security

Never commit `.env`, `credentials/`, or `local-schedule.json` with tokens.
