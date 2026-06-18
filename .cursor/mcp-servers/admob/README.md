# AdMob MCP

Local MCP server for the [Google AdMob API](https://developers.google.com/admob/api). Use it from Cursor to list apps/ad units, pull earnings reports, and sync IDs into `rasoi_mobile`.

Rasoi Android app ID: `ca-app-pub-4173581536398147~9898362276`  
Google account: **`my.website.email2@gmail.com`** (AdMob owner)

## One-time setup

1. **Google Cloud Console** — log in as **`my.website.email2@gmail.com`**:
   - Enable **AdMob API** on your project.
   - **Credentials → Create → OAuth client ID → Desktop app**.
   - Download JSON → save as `.cursor/mcp-servers/admob/credentials/client_secret.json`

2. **Env file**:
   ```bash
   cp .cursor/mcp-servers/admob/.env.example .cursor/mcp-servers/admob/.env
   ```

3. **OAuth login** (opens browser):
   ```bash
   chmod +x .cursor/mcp-servers/admob/run.sh
   .cursor/mcp-servers/admob/run.sh auth
   ```
   Sign in as **`my.website.email2@gmail.com`** when the browser opens.

4. **Reload MCP** in Cursor (Settings → Tools & MCP → refresh).

## MCP tools

| Tool | Purpose |
|------|---------|
| `admob_auth_status` | Check credentials + publisher code |
| `admob_get_account` | Publisher timezone / currency |
| `admob_list_apps` | Apps in AdMob (verify Rasoi Android) |
| `admob_list_ad_units` | Banner/interstitial unit IDs for code |
| `admob_network_report` | Earnings / impressions by date |
| `admob_rasoi_config` | Paths to `app.json`, `AdMobBanner.tsx` |

## Next step after auth

Run `admob_list_ad_units` and paste banner unit IDs into `rasoi_mobile/constants/admob.ts` (replace Google test IDs before release).
