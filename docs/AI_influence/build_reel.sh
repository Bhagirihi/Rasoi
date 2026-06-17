#!/usr/bin/env bash
# Build Rasoi Instagram Reel with AI influencer expression sequences.
# Requires: ffmpeg
# Output: docs/AI_influence/rasoi_reel_v1.mp4 (1080x1920, ~27s)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT_DIR="$ROOT/docs/AI_influence"
WORK="$OUT_DIR/.reel_build"
FONT="/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG="/System/Library/Fonts/Supplemental/Arial.ttf"
FPS=30
XFADE=0.5
CLIP=2.2

mkdir -p "$WORK/clips"
rm -f "$WORK"/*.mp4 "$WORK"/concat.txt "$WORK/clips"/*.mp4

portrait_vf() {
  local text="${1:-}"
  local subtext="${2:-}"
  local base="crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=1080:1920:flags=lanczos,fps=${FPS}"

  if [[ -n "$text" ]]; then
    base="${base},drawtext=fontfile='${FONT}':text='${text}':fontsize=72:fontcolor=white:borderw=4:bordercolor=0x000000AA:x=(w-text_w)/2:y=h*0.10"
  fi
  if [[ -n "$subtext" ]]; then
    base="${base},drawtext=fontfile='${FONT_REG}':text='${subtext}':fontsize=44:fontcolor=0xFFF9F6:borderw=2:bordercolor=0x00000088:x=(w-text_w)/2:y=h*0.17"
  fi
  echo "$base"
}

make_clip() {
  local image="$1"
  local vf="$2"
  local out="$3"
  ffmpeg -y -hide_banner -loglevel error \
    -loop 1 -framerate "$FPS" -i "$image" \
    -vf "$vf" -t "$CLIP" -r "$FPS" \
    -pix_fmt yuv420p -c:v libx264 -preset ultrafast "$out"
}

# Crossfade pre-rendered clips (constant frame rate)
xfade_clips() {
  local out="$1"
  shift
  local clips=("$@")
  local n=${#clips[@]}

  if [[ $n -eq 1 ]]; then
    cp "${clips[0]}" "$out"
    return
  fi

  local inputs=()
  for c in "${clips[@]}"; do inputs+=(-i "$c"); done

  local filters=""
  local prev="0:v"
  local offset
  offset=$(awk "BEGIN {print $CLIP - $XFADE}")
  local timeline="$CLIP"

  for ((i=1; i<n; i++)); do
    local outlabel="v${i}"
    if [[ $i -eq $((n-1)) ]]; then outlabel="outv"; fi
    filters+="[${prev}][${i}:v]xfade=transition=fade:duration=${XFADE}:offset=${offset}[${outlabel}];"
    prev="$outlabel"
    timeline=$(awk "BEGIN {print $timeline + $CLIP - $XFADE}")
    offset=$(awk "BEGIN {print $timeline - $XFADE}")
  done
  filters="${filters%;}"

  ffmpeg -y -hide_banner -loglevel error \
    "${inputs[@]}" -filter_complex "$filters" \
    -map "[outv]" -c:v libx264 -preset fast -crf 19 "$out"
}

make_expression_scene() {
  local text="$1"
  local subtext="$2"
  local out="$3"
  local tag="$4"
  shift 4
  local images=("$@")
  local vf
  vf=$(portrait_vf "$text" "$subtext")

  local clips=()
  local i=0
  for img in "${images[@]}"; do
    local clip="$WORK/clips/${tag}_${i}.mp4"
    make_clip "$img" "$vf" "$clip"
    clips+=("$clip")
    i=$((i + 1))
  done
  xfade_clips "$out" "${clips[@]}"
}

make_app_scene() {
  local input="$1"
  local duration="$2"
  local text="$3"
  local out="$4"

  ffmpeg -y -hide_banner -loglevel error \
    -loop 1 -framerate "$FPS" -i "$input" \
    -vf "scale=920:-1,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0xFF9933,drawtext=fontfile='${FONT}':text='${text}':fontsize=64:fontcolor=white:borderw=3:bordercolor=0x000000AA:x=(w-text_w)/2:y=120,fps=${FPS}" \
    -t "$duration" -r "$FPS" -pix_fmt yuv420p -c:v libx264 -preset fast -crf 20 "$out"
}

make_end_card() {
  local duration="$1"
  local out="$2"

  ffmpeg -y -hide_banner -loglevel error \
    -f lavfi -i "color=c=0xFF6B35:s=1080x1920:d=${duration}:r=${FPS}" \
    -vf "drawtext=fontfile='${FONT}':text='Rasoi':fontsize=120:fontcolor=white:x=(w-text_w)/2:y=h*0.38,drawtext=fontfile='${FONT_REG}':text='Aaj kya banaye?':fontsize=56:fontcolor=0xFFF9F6:x=(w-text_w)/2:y=h*0.48,drawtext=fontfile='${FONT_REG}':text='Download Free':fontsize=48:fontcolor=white:box=1:boxcolor=0x00000055:boxborderw=16:x=(w-text_w)/2:y=h*0.62,drawtext=fontfile='${FONT_REG}':text='rasoiapplication.in':fontsize=36:fontcolor=0xFFF9F6:x=(w-text_w)/2:y=h*0.72" \
    -t "$duration" -pix_fmt yuv420p -c:v libx264 -preset fast -crf 20 "$out"
}

echo "Building expression sequences..."

make_expression_scene "Aaj kya banaye?" "" "$WORK/01_hook.mp4" "s1" \
  "$OUT_DIR/scene01_confused.png" \
  "$OUT_DIR/scene01_thinking.png" \
  "$OUT_DIR/scene01_fridge_thinking.png"

make_expression_scene "Dinner, decided." "In 30 seconds" "$WORK/02_solution.mp4" "s2" \
  "$OUT_DIR/scene02_focused_phone.png" \
  "$OUT_DIR/scene02_phone_smile.png" \
  "$OUT_DIR/scene02_relief_smile.png"

make_app_scene "$ROOT/docs/marketing/app-store-screenshots/03-feature-cook-with-ingredients.png" 5 "Smart Pantry Match" "$WORK/03_app.mp4"

make_expression_scene "Cook with what you have" "15 cuisines - Veg and more" "$WORK/04_cook.mp4" "s3" \
  "$OUT_DIR/scene03_stirring_focused.png" \
  "$OUT_DIR/scene03_tasting_bliss.png" \
  "$OUT_DIR/scene03_cooking_happy.png"

make_end_card 5 "$WORK/05_end.mp4"

echo "Concatenating..."
printf "file '%s'\n" \
  "$WORK/01_hook.mp4" "$WORK/02_solution.mp4" "$WORK/03_app.mp4" \
  "$WORK/04_cook.mp4" "$WORK/05_end.mp4" > "$WORK/concat.txt"

ffmpeg -y -hide_banner -loglevel error \
  -f concat -safe 0 -i "$WORK/concat.txt" \
  -c copy "$OUT_DIR/rasoi_reel_v2.mp4"

mv "$OUT_DIR/rasoi_reel_v2.mp4" "$OUT_DIR/rasoi_reel_v1.mp4"

echo "Done: $OUT_DIR/rasoi_reel_v1.mp4"
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUT_DIR/rasoi_reel_v1.mp4" | xargs -I{} echo "Duration: {}s"
