# Android MCP

ADB control for connected Android devices and emulators ([CursorTouch/Android-MCP](https://github.com/CursorTouch/Android-MCP)).

Configured in [`.cursor/mcp.json`](../../mcp.json).

## Requirements

- `adb` on PATH (`android platform-tools`)
- USB debugging enabled; device shows in `adb devices`
- Python 3.10+ (venv created automatically on first run)

## Wi‑Fi debugging

Set env on the `android-mcp` server in `mcp.json`:

```json
"env": {
  "ANDROID_MCP_CONNECTION": "wifi",
  "ANDROID_MCP_HOST": "192.168.x.x"
}
```

Or pass `--wifi <ip>` in `args` after the run script path.
