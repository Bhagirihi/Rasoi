# Agent routing (Rasoi)

## The three you reach for most

| Agent | One-line scope |
|-------|----------------|
| **`react-native-expo-expert`** | Code in `rasoi_mobile/` |
| **`nextjs-seo-expert`** | Code in `rasoi_backend/` (API, admin, SEO pages) |
| **`recipe-food-expert`** | Culinary judgment on recipe *content* (readonly) |

**Quick pick:** mobile bug → mobile agent. API/website → backend agent. "Is this recipe wrong?" → recipe agent.

## MCP vs agents

| Layer | Role | Examples |
|-------|------|----------|
| **MCP** | Tools — fetch live data, run platform actions | Supabase query, Vercel deploy status, Play Console, AdMob, device adb |
| **Agent** | Judgment + code changes | Fix the API, rewrite a screen, review recipe authenticity |

Call MCP first when you need production truth; use an agent to decide what to change and implement it.

## Full roster

| Agent | Use when |
|-------|----------|
| `software-architect` | New feature design across mobile + API + DB |
| `database-supabase-architect` | Migrations, RLS, schema, query optimization |
| `devops-cloud-expert` | Deploy pipeline, EAS/APK, GitHub↔Vercel, prod QA gates |
| `ui-ux-designer` | UX review without implementation |
| `marketing-aso-growth` | ASO, ads, growth copy, creatives |
| `google-play-compliance` | Play policy, ratings, data safety |
| `legal-licensing` | Privacy, terms, SDK compliance, deletion |

Built-in reviewers: `bugbot`, `security-review`, `ci-investigator`. Device QA skill: `.cursor/skills/expo-mobile-qa/`.

## When to add a new agent

**Evidence only.** Create a narrow specialist when the same topic has been routed to the wrong agent **three times** — not preemptively.

Before adding one, try: tighten an existing agent's description, add a Cursor rule, or add a skill for repeatable automation.
