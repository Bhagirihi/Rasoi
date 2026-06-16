# Rasoi on Hostinger — `rasoiapplication.in`

Domain registered on Hostinger, app served via Vercel (Next.js backend).

## Current setup

| Item | Value |
|------|--------|
| **Domain** | `rasoiapplication.in` (Hostinger, active until 2029) |
| **Website + API** | `https://rasoiapplication.in` (Vercel project `rasoiapp`) |
| **Legacy URL** | `https://rasoiapp.vercel.app` (still works) |
| **Mobile API** | `https://rasoiapplication.in` + `/api/...` paths |
| **SEO** | [`docs/marketing/SEO.md`](marketing/SEO.md) |

## DNS (Hostinger)

Configured via Hostinger MCP / DNS zone:

| Type | Name | Value |
|------|------|--------|
| A | `@` | `76.76.21.21` (Vercel) |
| CNAME | `www` | `cname.vercel-dns.com` |

**Verify:** `dig +short rasoiapplication.in` → `76.76.21.21`

## What Hostinger has vs Vercel

| Service | Provider |
|---------|----------|
| Domain registration | Hostinger |
| DNS management | Hostinger (`horizon.dns-parking.com` nameservers) |
| Next.js app hosting | Vercel |
| PostgreSQL database | Supabase |

You do **not** have a Hostinger web hosting plan yet (only domain). The app runs on Vercel — Hostinger handles the domain and DNS.

## Optional next steps

1. **Email** — Add MX records in Hostinger DNS (Google Workspace / Hostinger Email).
2. **Ad image CDN** — Upload `docs/marketing/ad-images/` to Hostinger or Supabase public bucket for Instagram API.
3. **Full Hostinger hosting** — Purchase Web Hosting + `hosting_createWebsiteV1` if you want to move off Vercel (not recommended for Next.js + Supabase stack).

## MCP commands used

- `domains_getDomainListV1` — list domains
- `DNS_updateDNSRecordsV1` — point domain to Vercel
- Vercel CLI — `vercel domains add rasoiapplication.in`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Site shows parking page | Wait for DNS propagation (up to 24h); confirm A record is `76.76.21.21` |
| Vercel SSL pending | Ensure domain is added under Vercel project **rasoiapp** → Settings → Domains |
| App still hits old URL | Rebuild mobile app after `PROD_API_URL` change |
