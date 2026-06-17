# Instagram search — @rasoi_app

**Goal:** Show up when people search **jamvanu**, **rasoi**, **recipe**, **rasoi app** on Instagram.

Instagram search ranks **username**, **name**, **bio**, **caption text**, **hashtags**, and **engagement**. No one can guarantee position #1, but these are the levers we control.

---

## Live optimizations (automated)

| Surface | Keywords embedded |
|---------|---------------------|
| **Username** | `@rasoi_app` (matches “rasoi”, “rasoi app”) |
| **Name** | `Rasoi App · Recipe · Jamvanu` |
| **Bio** | jamvanu, rasoi recipe app, aaj kya banaye, Indian recipes |
| **Link in bio** | https://rasoiapplication.in/download |
| **Every post caption** | First line: `Rasoi app · Indian recipe app · Jamvanu · Aaj kya banaye?` |
| **Hashtags** | `#Jamvanu #JamvanuRecipe #RasoiApp #RecipeApp #IndianRecipeApp #Recipe` |

Configured in `.cursor/mcp-servers/instagram/instagram_seo.py` and applied by the campaign scheduler.

---

## Target searches

| Query | Why we match |
|-------|----------------|
| jamvanu | Gujarati “what to eat”; in name, bio, captions, hashtags |
| rasoi | Username `@rasoi_app`, `#Rasoi`, brand in every post |
| recipe | Name “Recipe”, `#Recipe`, “recipe app” in bio/captions |
| rasoi app | Name + caption line + `#RasoiApp` |

---

## What still helps ranking (manual)

1. **Consistency** — daily posts (GitHub Action at 7 PM IST) build keyword + engagement signals.
2. **Reels** — Instagram prioritizes Reels in search; post `docs/AI_influence/rasoi_reel_v1.mp4` with same keywords in caption.
3. **Engagement** — reply to comments, share to Stories, ask “Jamvanu?” in Stories polls.
4. **Gujarat geo** — run Ad 7 (Gujarati) early; use `#Jamvanu` heavily in Gujarat-targeted Stories.
5. **Avoid keyword stuffing** — one SEO line + natural headline is enough; don’t repeat “rasoi app” 20 times.

---

## Refresh profile SEO

```bash
cd .cursor/mcp-servers/instagram
source .env
.venv/bin/python -c "from instagram_client import InstagramClient; print(InstagramClient().update_profile_seo())"
```

---

## Related

- Web SEO: [`SEO.md`](./SEO.md)
- Ad captions + schedule: `.cursor/mcp-servers/instagram/scheduler.py`
