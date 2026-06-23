# Rasoi mobile dev MCPs

Project MCP servers for React Native / Expo debugging, docs, and device QA. Configured in [`.cursor/mcp.json`](../../mcp.json).

After editing config: **Cursor → Settings → Tools & MCP** → confirm servers are green, or run **Developer: Reload Window**.

---

## Reactotron MCP

Inspect app state, network, timeline, and send commands to a running app.

**Requires**

1. [Reactotron](https://github.com/infinitered/reactotron) desktop app (optional but recommended).
2. Reactotron in the app pointed at the **proxy** port (not 9090 directly):

```ts
Reactotron.configure({ host: 'localhost', port: 9091 }).connect();
```

The MCP proxy listens on `9091` and forwards to Reactotron on `9090`.

**Alternative:** Reactotron desktop built-in MCP — toggle **MCP** in the footer, then add HTTP server `http://localhost:4567/mcp` in Cursor (no `reactotron-mcp` package).

---

## Radon AI MCP

Up-to-date React Native / Expo library docs, Metro logs, screenshots, component tree, and app reload — via [Radon IDE](https://ide.swmansion.com/).

**Requires**

- Radon IDE extension installed in Cursor or VS Code.
- Active Radon license.
- `rasoi_mobile` open with Metro + simulator/emulator running.

Proxy: `npx radon-mcp@latest rasoi_mobile` (project path is set in `mcp.json`).

---

## Context7

Live documentation for thousands of libraries (React Native, Expo, Supabase, etc.) to reduce outdated answers.

Remote server — no local install. Optional API key for higher limits:

```json
"context7": {
  "url": "https://mcp.context7.com/mcp",
  "headers": {
    "CONTEXT7_API_KEY": "YOUR_KEY"
  }
}
```

Get a key at [context7.com](https://context7.com).

---

## Android MCP (`android-mcp`)

ADB control for a connected Android device or emulator: UI automation, screenshots, package management.

**Requires**

- `adb` on PATH (`platform-tools`).
- USB debugging enabled, device authorized (`adb devices`).
- First run installs a local venv via [`.cursor/mcp-servers/android-mcp/run.sh`](../android-mcp/run.sh) (no `uvx` needed).

Wi‑Fi debugging (optional) — add to `env` in `mcp.json`:

```json
"env": {
  "ANDROID_MCP_CONNECTION": "wifi",
  "ANDROID_MCP_HOST": "192.168.x.x"
}
```

Package: [CursorTouch/Android-MCP](https://github.com/CursorTouch/Android-MCP).

---

## Mobile MCP (`@mobilenext/mobile-mcp`)

Cross-platform mobile automation (Android + iOS) for AI-driven UI testing and QA from Cursor.

**Requires**

- Same as Android MCP for physical devices; iOS needs Xcode simulator or device.
- Works alongside the existing [expo-mobile-qa](../../skills/expo-mobile-qa/SKILL.md) skill and Maestro flows.

Docs: [mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp).

---

## Quick checks

| Server       | Verify |
|-------------|--------|
| Reactotron  | App connected on port 9091; ask agent to read recent logs |
| Radon       | Radon IDE running; ask agent to query Expo SDK docs |
| Context7    | Ask agent to fetch latest `expo-router` docs |
| Android MCP | `adb devices` shows device; ask agent to take a screenshot |
| Mobile MCP  | Device connected; ask agent to list available devices |
