# Google Search Console MCP (Rasoi)

Read-only [Google Search Console](https://search.google.com/search-console) tools for Cursor: search analytics, URL inspection, sitemap status.

Uses [`@vmandic/searchconsole-mcp`](https://github.com/vmandic/searchconsole-mcp) (npm).

## One-time setup

1. **Enable the API** on your Google Cloud project:
   ```bash
   gcloud services enable searchconsole.googleapis.com
   ```

2. **Sign in** (Application Default Credentials, read-only):
   ```bash
   gcloud auth application-default login \
     --scopes=https://www.googleapis.com/auth/webmasters.readonly
   ```

3. **Copy env** (optional default property):
   ```bash
   cp .env.example .env
   ```

4. **Restart Cursor** → Settings → MCP → confirm `google-search-console` is connected.

## Rasoi property

- Site: `https://rasoiapplication.in/`
- Sitemap: `https://rasoiapplication.in/sitemap.xml`
- Play Store landing (on-domain): `https://rasoiapplication.in/google-play/rasoi-aaj-kya-banaye-indian-recipe-app-android`

Do **not** put `play.google.com` URLs in the sitemap — Search Console only allows URLs on the verified property.

## Example prompts in Cursor

- "List sitemaps for rasoiapplication.in"
- "Show top queries last 28 days for https://rasoiapplication.in/"
- "Inspect URL https://rasoiapplication.in/download"
