# Rasoi AI Influencer Reel — Production Guide

**Format:** Instagram Reels · 9:16 · 1080×1920 · 25s  
**Character:** AI influencer (see `influencer_profile.png`, `facePrompt.txt`)  
**Brand:** Rasoi — *Aaj kya banaye?* · terracotta `#FF9933`–`#FF6B35` · cream `#FFF9F6`

---

## v1 Reel (ready to publish)

| File | Description |
|------|-------------|
| `rasoi_reel_v1.mp4` | Assembled Reel with **expression crossfades** — run `./build_reel.sh` to regenerate |
| `scene01_*.png` | Problem arc: confused → thinking → chin touch |
| `scene02_*.png` | Solution arc: phone focus → smile → relief |
| `scene03_*.png` | Payoff arc: stirring → tasting → happy cook |

### Expression animation (how it works)

Each influencer scene uses **3 AI-generated expression frames** crossfaded over ~5 seconds. This simulates facial movement and emotional beats without needing a video AI tool yet.

| Scene | Expression arc |
|-------|----------------|
| **Hook** | Overwhelmed → deciding → thoughtful |
| **Solution** | Phone focus → gentle smile → relief |
| **Cooking** | Stirring focus → tasting bliss → happy cook |

To add more motion later, run each frame through Runway/Kling image-to-video (prompts below) and replace the static clips in `build_reel.sh`.

### Storyboard (27 seconds)

| Time | Visual | On-screen text | Audio suggestion |
|------|--------|----------------|------------------|
| 0–4s | Scene 01 — fridge, thoughtful | **Aaj kya banaye?** | Soft kitchen ambience |
| 4–9s | Scene 02 — phone smile | **Dinner, decided.** · In 30 seconds | Light upbeat beat drops |
| 9–15s | App screenshot — pantry match | **92% Pantry Match** | Whoosh / UI tap SFX |
| 15–20s | Scene 03 — cooking | **Cook with what you have** | Sizzle / kadai sounds |
| 20–25s | End card — brand orange | **Rasoi** · Download Free | Logo sting |

### Rebuild

```bash
cd docs/AI_influence
chmod +x build_reel.sh
./build_reel.sh
```

---

## Caption (copy-paste)

```
Aaj kya banaye? 🤔

Fridge full hai — phir bhi dinner ka stress?

Rasoi picks tonight's meal from what's already in your kitchen.
Pantry match · 15 regional cuisines · Veg & non-veg

Download free 👇
Link in bio → rasoiapplication.in

#RasoiApp #AajKyaBanaye #IndianFood #HomeCooking #WhatsForDinner #RecipeReels #FoodReels #PantryCooking #IndianRecipes #FoodTech
```

---

## Upgrade path (AI video tools)

For smoother motion, run each scene through **image-to-video** with the same character reference:

### Scene 01 — image-to-video prompt

```
Slow cinematic push-in. South Asian woman in cream kurta stands before open refrigerator, hand on chin, thoughtful expression. Subtle head tilt, blinks naturally. Kitchen ambient light, shallow depth of field. 4 seconds, vertical 9:16, photorealistic.
```

**Input:** `scene01_fridge_thinking.png`  
**Tools:** Runway Gen-3, Kling 1.6, Pika, or Google Veo (reference image mode)

### Scene 02 — image-to-video prompt

```
Woman smiles with relief while scrolling phone in warm kitchen. Gentle thumb movement on screen, soft laugh, eyes lift from phone to camera. 5 seconds, vertical 9:16, lifestyle commercial.
```

**Input:** `scene02_phone_smile.png`

### Scene 03 — image-to-video prompt

```
Woman stirs colorful sabzi in kadai, steam rises, satisfied smile. Slow stirring motion, warm golden kitchen lighting. 5 seconds, vertical 9:16, food commercial.
```

**Input:** `scene03_cooking_happy.png`

### App screen insert

Screen-record real Rasoi app (3–5s): **Home → Pantry → Tonight's pick with match %**. Replace the static screenshot in `build_reel.sh` with the screen recording for higher conversion.

---

## Character consistency checklist

When generating new frames or video clips, always include from `facePrompt.txt`:

- Age 27–30, South Asian, warm medium-light skin
- Almond dark brown eyes, straight nose, natural lips
- Black hair — low bun, face-framing strands
- Cream floral cotton kurta, gold earrings, minimalist necklace
- Modern Indian kitchen, warm terracotta/beige palette

**Reference images (in order of priority):** `influencer_profile.png` → `influencer_front_face.png` → side profiles

---

## Publishing

Instagram MCP currently posts **photos only**. For Reels:

1. Upload `rasoi_reel_v1.mp4` manually in Instagram app, or
2. Use Meta Business Suite / Creator Studio for scheduled Reels

**Specs:** H.264, 1080×1920, 15–90s (this reel is 25s), hook in first 2 seconds ✓

---

## Series ideas (batch with same character)

1. **#AajKyaBanaye** — weekly “3 ingredients → dinner” (alo + pyaz + tamatar)
2. **#PantryToPlate** — screen record + influencer reaction cutaways
3. **#RasoiRegional** — one cuisine per week (Gujarati, South, Punjabi)
4. **#KitchenTruth** — “Tuesday 8pm, kuch plan nahi” relatable hook

See `docs/SOCIAL_BRANDING_PLAN.md` §6 for the full 10-Reel shot list.
