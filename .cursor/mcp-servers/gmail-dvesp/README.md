# Gmail MCP — dvesp1901@gmail.com

Reads **dvesp1901@gmail.com** via Gmail IMAP. Used for Rasoi QA OTP (`dvesp1901+{timestamp}@gmail.com` plus-addressing lands in this inbox).

Configured in [`.cursor/mcp.json`](../../mcp.json) as **`gmail-dvesp`**.

Shares the Python server with [`../gmail-imap`](../gmail-imap/server.py).

## Setup

1. On **dvesp1901@gmail.com**: enable 2-Step Verification, then create an **App password** (Google Account → Security → App passwords).
2. Copy `.env.example` → `.env` and set `GMAIL_APP_PASSWORD`.
3. Reload MCP in Cursor (Settings → Tools & MCP → refresh).

## Tools

| Tool | Purpose |
|------|---------|
| `list_recent_emails` | Recent inbox summaries |
| `search_emails` | Search by subject/from text |
| `read_email` | Full message by IMAP id |
| `find_latest_otp` | Latest Rasoi sign-in code (default subject: "Rasoi sign-in code") |

## Quick test

```bash
cd .cursor/mcp-servers/gmail-dvesp
cp .env.example .env   # then edit GMAIL_APP_PASSWORD
source .env
../../rasoi_mobile/scripts/fetch-otp.py
```
