#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_ID="${1:-}"

cd "$ROOT/../rasoi_mobile"

if [[ -z "$BUILD_ID" ]]; then
  BUILD_ID="$(npx eas build:list --platform android --limit 1 --non-interactive --json 2>/dev/null \
    | node -e "
      let d=''; process.stdin.on('data',c=>d+=c);
      process.stdin.on('end',()=>{
        try {
          const j=JSON.parse(d);
          const builds=j[0]||j.items?.[0]||j.builds?.[0];
          process.stdout.write(builds?.id||'');
        } catch { process.stdout.write(''); }
      });
    ")"
fi

if [[ -z "$BUILD_ID" ]]; then
  echo "No EAS build found."
  exit 1
fi

echo "Fetching build $BUILD_ID..."
ARTIFACT_URL="$(npx eas build:view "$BUILD_ID" --json 2>/dev/null \
  | node -e "
    let d=''; process.stdin.on('data',c=>d+=c);
    process.stdin.on('end',()=>{
      try {
        const j=JSON.parse(d);
        const url=j.artifacts?.applicationArchiveUrl||j.artifacts?.buildUrl||'';
        const status=j.status||'';
        if (!url) {
          console.error('Build status: ' + status + ' — artifact not ready yet.');
          process.exit(2);
        }
        process.stdout.write(url);
      } catch (e) {
        console.error('Could not parse build JSON');
        process.exit(1);
      }
    });
  ")"

echo "Expo APK URL:"
echo "$ARTIFACT_URL"
echo ""
echo "Set on Vercel (production):"
echo "  vercel env add ANDROID_APK_EXPO_URL production"
echo "  (paste URL above)"
echo ""
echo "Or export locally for testing:"
echo "  export ANDROID_APK_EXPO_URL='$ARTIFACT_URL'"
