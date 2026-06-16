# Instagram MCP (meta-mcp)

Uses [@exileum/meta-mcp](https://github.com/exileum/meta-mcp) for posting and managing a Business/Creator Instagram account via Meta's official API.

## Setup

1. Switch your Instagram account to **Business** or **Creator** (Settings → Account type).
2. Create a Meta app at [developers.facebook.com](https://developers.facebook.com).
3. Add product: **Instagram → API setup with Instagram business login**.
4. Under **Generate access tokens**, add your Instagram account and copy the long-lived token.
5. Copy `.env.example` → `.env` and set:
   - `INSTAGRAM_ACCESS_TOKEN` — your `IGAA…` token
   - `INSTAGRAM_USER_ID` — numeric user ID from `/me`, or `me`
6. Reload MCP in Cursor (Settings → MCP → refresh, or restart Cursor).

## What you can do

- **Publish:** photos, reels, carousels, stories
- **Manage:** comments, DMs (needs App Review), insights, hashtags
- **Analytics:** account and post-level metrics

Tokens expire in ~60 days. Use the `meta_refresh_token` tool with `platform: "instagram"` before expiry.
