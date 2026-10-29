# Rasoi PMPG Design System

Visual identity for the Personalized Meal Planner & Grocery List feature
(week plan screen, grocery tab, add-to-plan flows). Adapted from
`playful-color.md` in TrustOtc/awesome-mobile-design-md (the DESIGN.md
collection behind sleek.design/design-md): the system below keeps that
file's spacing, typography, component, and motion rules exactly, and maps
its palette onto Rasoi's existing brand colors (already in
`constants/theme.ts`) so the new screens feel like Rasoi, not a second app.

## 1. Design Principles

- Playful, vibrant, and expressive — planning food should feel inviting,
  not like a spreadsheet.
- Friendly and approachable visual language; color communicates state
  (slot, progress, bought vs. pending).
- Soft shapes, rounded corners, and lively spacing.
- Encourage exploration: swapping a meal or rebuilding a list is one tap.
- Designed for a consumer, high-retention surface: the week plan and the
  grocery list are the two screens a user opens every day.

## 2. Color System

### 2.1 Light Mode (Primary)

- Primary: #FF6B35 (terracotta — Rasoi brand; playful-color's indigo
  mapped to brand)
- Secondary: #FF9933 (saffron)
- Accent: #00A86B (green — also Success)
- Background: #FAFAFA (cream)
- Surface: #FFFFFF
- Surface Alt: #FFF4E6 (warm tint for slot cards)
- Text Primary: #1A1A2E
- Text Secondary: #6B7280
- Border: #E5E7EB
- Success: #00A86B
- Warning: #F4C430
- Error: #E53935

### 2.2 Dark Mode

Use `colors.dark` from `constants/theme.ts` (bg #0A0908, card #1C1714,
surface #14110F, text #F5F0E8, muted #9A9590). Slot accents become
translucent tints, same values as the existing Plan tab
(breakfast rgba(255,153,51,0.18), lunch rgba(255,107,53,0.18),
snack rgba(244,196,48,0.18), dinner rgba(26,26,46,0.35),
late night rgba(90,79,140,0.22)).

### 2.3 Rules

- Use multiple accent colors, but limit to 2–3 per screen (slot tints
  count as one family).
- Color guides attention: primary gradient only on the main action
  (Generate week, Rebuild list).
- Avoid overly muted palettes; maintain contrast even with vibrant colors.
- A checked grocery item is never color-only: strikethrough + check
  circle + "bought" count.

## 3. Typography

- Font Family: iOS System (San Francisco), Android Roboto.
- Scale: Large Title 30 / Bold, Title 22 / SemiBold, Body 16 / Regular,
  Caption 13 / Regular, Small 11 / Medium.
- Slightly larger type for friendliness; bold for emphasis.
- Avoid dense text blocks; line height 1.5–1.6.
- Recipe titles in plan/grocery rows: Body 16 / SemiBold, one line
  truncated; meta (prep time, calories) Caption 13.

## 4. Spacing System

Base unit: 4. xs 4, sm 8, md 12, lg 16, xl 20, xxl 24, xxxl 32
(`spacing` in `constants/theme.ts`).

- Generous spacing, relaxed feel; breathing room between sections.
- Screen padding 16 (`layout.screenPadding`); section gap 16.

## 5. Layout & Safe Area

- Respect safe area (`SafeAreaView`, top edge on tab screens).
- Default padding 16–20; section-based layout; no edge-to-edge dense
  content.
- Week plan: day strip on top, slot rows below. Grocery: progress header,
  then one section group after another.

## 6. Touch & Interaction

- Minimum touch target: iOS 44pt, Android 48dp.
- Feedback: scale 0.96–0.98; bounce allowed; haptics on assign, check,
  and generate (expo-haptics, as the Plan tab already does).
- Interaction feels lively and responsive: optimistic check-off on
  grocery rows, instant swap feedback on plan rows.

## 7. Navigation Patterns

- Tab + Stack hybrid. Grocery is a tab (6th, after Pantry). The week plan
  is a stack screen (`/planner-week`) reached from the Plan tab's
  "My week plan" button and from any recipe's "Add to week plan" button.
- Tab bar: colorful active state (primary tint), filled icons when
  active — existing tab bar behavior, unchanged.

## 8. Components

### 8.1 Button

- Primary (filled, terracotta→saffron gradient), Secondary (soft filled),
  Outline. Use `PrimaryButton` from `components/ui/Primitives`.
- Height 44–48, radius 16–20, color for hierarchy.

### 8.2 Card

- Background Surface or Surface Alt, radius 16–20, padding 16–20.
- Soft shadow (`shadows.card`); optional colored top bar or slot accent.
- Plan slot rows and grocery section groups are cards.

### 8.3 List Item

- Height 60–72, icons or illustrations, minimal dividers — spacing and
  color separation instead.
- Grocery rows: check circle (left), name, section-agnostic row height 60.

### 8.4 Input

- Background Surface, radius 14–18, soft border, colored focus highlight.
- Recipe picker search: friendly placeholder ("Search recipes…").

## 9. Motion

- Duration 200–350ms; playful and dynamic; spring animations encouraged;
  micro-interactions encouraged (check pop, swap fade).

## 10. Elevation & Depth

- Soft shadows; cards slightly lifted; avoid flat, rigid layouts.
  (`shadows.card`, `shadows.cardLifted` in theme.)

## 11. Iconography

- lucide-react-native, rounded and friendly, slightly thicker strokes
  allowed. Sizes: small 16, default 22–24, large 28–32.
- Slot icons (same as Plan tab): Breakfast Sunrise, Lunch Sun,
  Snack Cookie, Dinner Moon, Late night MoonStar. Grocery: ShoppingCart.

## 12. Accessibility

- Ensure contrast despite vibrant palette; never rely solely on color
  (checked = circle + strikethrough + count).
- Support dynamic type scaling; touch targets per section 6.

## 13. Platform Adaptation

- iOS: more playful animations allowed, smooth transitions.
- Android: slightly reduce animation intensity, keep performance in mind.

## 14. Do / Don't

### Do

- Use color intentionally; keep UI fun and engaging.
- Keep consistency with the Plan tab (same slot tints, same header).
- Show honest data: the grocery list has item names, not quantities —
  recipe data carries no qty/unit (see `lib/grocery-list.ts`). Never
  invent quantities.

### Don't

- Overuse too many colors at once; mix conflicting palettes.
- Make UI visually overwhelming; no dense grids on the grocery tab.
- Fake a quantity, price, or store availability the backend did not
  return. Partner shop opens a search for one item (partner apps accept
  a single search term).
