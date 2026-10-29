import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Cookie, Moon, MoonStar, Sun, Sunrise } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import OfflineBanner from '@/components/OfflineBanner';
import { EmptyState, PrimaryButton } from '@/components/ui/Primitives';
import { layout, radius, scrollIndicator, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useRecipes } from '@/context/RecipesContext';
import {
  addPlanItem,
  generateWeekPlan,
  getWeekDates,
  getWeekPlan,
  getWeekStartString,
  setPlanItemStatus,
  shiftWeek,
  type MealSlot,
  type PlanItem,
} from '@/services/planner';

const SLOT_META: Array<{ slot: MealSlot; label: string; Icon: typeof Sunrise; tint: string }> = [
  { slot: 'breakfast', label: 'Breakfast', Icon: Sunrise, tint: '#FFF4E6' },
  { slot: 'lunch', label: 'Lunch', Icon: Sun, tint: '#FFF0EA' },
  { slot: 'snack', label: 'Snack', Icon: Cookie, tint: '#FFF9E6' },
  { slot: 'dinner', label: 'Dinner', Icon: Moon, tint: '#F3EDE8' },
  { slot: 'lateNight', label: 'Late night', Icon: MoonStar, tint: '#EFECFB' },
];

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function todayKey(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function fmtDay(key: string): string {
  const d = parseKey(key);
  return `${WEEKDAY_SHORT[d.getDay()]} ${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
}

function paramToString(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function PlannerWeekScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recipeId?: string; title?: string }>();
  const { colors: themeColors, screenBackground } = useTheme();
  const { recipes } = useRecipes();

  const [weekStart, setWeekStart] = useState(() => getWeekStartString());
  const [selectedDate, setSelectedDate] = useState(() => todayKey());
  const [planId, setPlanId] = useState<string | null>(null);
  const [items, setItems] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerSlot, setPickerSlot] = useState<MealSlot | null>(null);
  const [pickerQuery, setPickerQuery] = useState('');
  const [pendingRecipe, setPendingRecipe] = useState<{ id: string; title: string } | null>(() => {
    const id = paramToString(params.recipeId);
    const title = paramToString(params.title);
    return id ? { id, title: title ?? 'this recipe' } : null;
  });

  const load = useCallback(async (week: string) => {
    try {
      setError(null);
      const result = await getWeekPlan(week);
      setPlanId(result.plan.id);
      setItems(result.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load your week plan');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    void load(weekStart);
  }, [weekStart, load]);

  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);
  const dayItems = useMemo(() => {
    const map = new Map<MealSlot, PlanItem>();
    for (const item of items) {
      if (item.date === selectedDate) map.set(item.mealSlot, item);
    }
    return map;
  }, [items, selectedDate]);

  const pickerResults = useMemo(() => {
    const query = pickerQuery.trim().toLowerCase();
    const list = query
      ? recipes.filter((recipe) => recipe.title.toLowerCase().includes(query))
      : recipes;
    return list.slice(0, 30);
  }, [recipes, pickerQuery]);

  function changeWeek(weeks: number) {
    const next = shiftWeek(weekStart, weeks);
    setWeekStart(next);
    setSelectedDate(next);
    setPickerSlot(null);
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const result = await generateWeekPlan(weekStart);
      setPlanId(result.plan.id);
      setItems(result.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not generate your week plan');
    } finally {
      setGenerating(false);
    }
  }

  async function assignRecipe(recipeId: string, date: string, slot: MealSlot) {
    if (!planId) return;
    try {
      await addPlanItem({ planId, date, mealSlot: slot, recipeId });
      setPickerSlot(null);
      setPendingRecipe(null);
      await load(weekStart);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add that meal');
    }
  }

  async function handleSlotAdd(slot: MealSlot) {
    if (pendingRecipe) {
      await assignRecipe(pendingRecipe.id, selectedDate, slot);
      return;
    }
    setPickerQuery('');
    setPickerSlot(slot);
  }

  async function handleStatus(item: PlanItem, status: 'cooked' | 'planned' | 'removed') {
    try {
      await setPlanItemStatus(item.id, status);
      await load(weekStart);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update that meal');
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: screenBackground }]} edges={['top']}>
      <OfflineBanner />
      <ScrollView
        {...scrollIndicator}
        style={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              void load(weekStart);
            }}
            tintColor={themeColors.primary}
            colors={[themeColors.primary]}
          />
        }
        contentContainerStyle={[styles.content, { paddingBottom: layout.tabBarExtra }]}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
            <ChevronLeft size={24} color={themeColors.charcoal} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: themeColors.charcoal }]}>Week plan</Text>
            <Text style={[styles.headerSubtitle, { color: themeColors.muted }]}>
              {fmtDay(weekDates[0])} – {fmtDay(weekDates[6])}
            </Text>
          </View>
          <Pressable onPress={() => changeWeek(-1)} style={styles.weekNav} accessibilityLabel="Previous week">
            <ChevronLeft size={22} color={themeColors.charcoal} />
          </Pressable>
          <Pressable onPress={() => changeWeek(1)} style={styles.weekNav} accessibilityLabel="Next week">
            <ChevronRight size={22} color={themeColors.charcoal} />
          </Pressable>
        </View>

        {pendingRecipe && (
          <View style={[styles.pendingBanner, { backgroundColor: themeColors.white, borderColor: themeColors.border }]}>
            <Text style={[styles.pendingText, { color: themeColors.charcoal }]}>
              Pick a day and slot for “{pendingRecipe.title}”.
            </Text>
            <Pressable onPress={() => setPendingRecipe(null)}>
              <Text style={[styles.pendingCancel, { color: themeColors.primary }]}>Cancel</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.dayStrip}>
          {weekDates.map((date) => {
            const d = parseKey(date);
            const selected = date === selectedDate;
            return (
              <Pressable
                key={date}
                onPress={() => {
                  setSelectedDate(date);
                  setPickerSlot(null);
                }}
                style={[
                  styles.dayButton,
                  { backgroundColor: selected ? themeColors.primary : themeColors.white, borderColor: themeColors.border },
                ]}
              >
                <Text style={[styles.dayLabel, { color: selected ? '#FFFFFF' : themeColors.muted }]}>
                  {WEEKDAY_SHORT[d.getDay()]}
                </Text>
                <Text style={[styles.dayNumber, { color: selected ? '#FFFFFF' : themeColors.charcoal }]}>
                  {d.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {!loading && !error && items.length === 0 && (
          <View>
            <EmptyState
              icon={Sunrise}
              title="No meals planned this week"
              subtitle="Generate a week from your diet, pantry, and preferences — then swap anything you don't like."
            />
            <PrimaryButton label={generating ? 'Generating…' : 'Generate my week'} onPress={() => void handleGenerate()} disabled={generating} />
          </View>
        )}

        {!loading && !error && items.length > 0 && (
          <View style={styles.slots}>
            {SLOT_META.map(({ slot, label, Icon, tint }) => {
              const item = dayItems.get(slot);
              return (
                <View key={slot} style={[styles.slotCard, { backgroundColor: themeColors.white, borderColor: themeColors.border }]}>
                  <View style={[styles.slotIcon, { backgroundColor: tint }]}>
                    <Icon size={22} color={themeColors.charcoal} />
                  </View>
                  <View style={styles.slotBody}>
                    <Text style={[styles.slotLabel, { color: themeColors.muted }]}>{label}</Text>
                    {item ? (
                      <>
                        <Text style={[styles.slotRecipe, { color: themeColors.charcoal }]} numberOfLines={1}>
                          {item.recipe.title}
                        </Text>
                        <Text style={[styles.slotMeta, { color: themeColors.muted }]}>
                          {item.recipe.prepTime} min · {item.recipe.calories} kcal
                          {item.status === 'cooked' ? ' · Cooked' : ''}
                        </Text>
                        <View style={styles.slotActions}>
                          <Pressable onPress={() => setPickerSlot(slot)}>
                            <Text style={[styles.slotAction, { color: themeColors.primary }]}>Swap</Text>
                          </Pressable>
                          <Pressable
                            onPress={() => void handleStatus(item, item.status === 'cooked' ? 'planned' : 'cooked')}
                          >
                            <Text style={[styles.slotAction, { color: themeColors.primary }]}>
                              {item.status === 'cooked' ? 'Undo cooked' : 'Mark cooked'}
                            </Text>
                          </Pressable>
                          <Pressable onPress={() => void handleStatus(item, 'removed')}>
                            <Text style={[styles.slotAction, { color: themeColors.muted }]}>Remove</Text>
                          </Pressable>
                        </View>
                      </>
                    ) : (
                      <Pressable onPress={() => void handleSlotAdd(slot)}>
                        <Text style={[styles.slotAdd, { color: themeColors.primary }]}>
                          {pendingRecipe ? `Add “${pendingRecipe.title}”` : 'Add meal'}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {!loading && !error && items.length > 0 && (
          <View style={styles.actions}>
            <PrimaryButton label={generating ? 'Generating…' : 'Regenerate week'} onPress={() => void handleGenerate()} disabled={generating} />
            <Text style={[styles.note, { color: themeColors.muted }]}>
              Regenerating re-picks open slots only — cooked, skipped, and removed meals stay as you left them.
            </Text>
            <Pressable onPress={() => router.push('/(tabs)/grocery')}>
              <Text style={[styles.groceryLink, { color: themeColors.primary }]}>View grocery list →</Text>
            </Pressable>
          </View>
        )}

        {pickerSlot && (
          <View style={[styles.picker, { backgroundColor: themeColors.white, borderColor: themeColors.border }]}>
            <Text style={[styles.pickerTitle, { color: themeColors.charcoal }]}>
              Pick a recipe for {SLOT_META.find((s) => s.slot === pickerSlot)?.label.toLowerCase()}
            </Text>
            <TextInput
              value={pickerQuery}
              onChangeText={setPickerQuery}
              placeholder="Search recipes…"
              placeholderTextColor={themeColors.muted}
              style={[styles.pickerInput, { borderColor: themeColors.border, color: themeColors.charcoal }]}
            />
            {pickerResults.map((recipe) => (
              <Pressable
                key={recipe.id}
                onPress={() => void assignRecipe(recipe.id, selectedDate, pickerSlot)}
                style={styles.pickerRow}
              >
                <Text style={[styles.pickerRowTitle, { color: themeColors.charcoal }]} numberOfLines={1}>
                  {recipe.title}
                </Text>
                <Text style={[styles.pickerRowMeta, { color: themeColors.muted }]}>
                  {recipe.prepTime} min · {recipe.calories} kcal
                </Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setPickerSlot(null)}>
              <Text style={[styles.pickerCancel, { color: themeColors.muted }]}>Close picker</Text>
            </Pressable>
          </View>
        )}

        {!loading && error && (
          <View>
            <EmptyState icon={Sunrise} title="Could not load your week plan" subtitle={error} />
            <PrimaryButton
              label="Try again"
              onPress={() => {
                setLoading(true);
                void load(weekStart);
              }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  backButton: { padding: spacing.xs },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  headerSubtitle: { fontSize: 13 },
  weekNav: { padding: spacing.xs },
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  pendingText: { fontSize: 14, flex: 1, lineHeight: 20 },
  pendingCancel: { fontSize: 14, fontWeight: '600' },
  dayStrip: { flexDirection: 'row', gap: spacing.sm },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
  },
  dayLabel: { fontSize: 11, fontWeight: '600' },
  dayNumber: { fontSize: 16, fontWeight: '700' },
  slots: { gap: spacing.md },
  slotCard: {
    flexDirection: 'row',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  slotIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  slotBody: { flex: 1, gap: 2 },
  slotLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  slotRecipe: { fontSize: 16, fontWeight: '600' },
  slotMeta: { fontSize: 13 },
  slotActions: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.xs },
  slotAction: { fontSize: 13, fontWeight: '600' },
  slotAdd: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  actions: { gap: spacing.md },
  note: { fontSize: 13, lineHeight: 19 },
  groceryLink: { fontSize: 16, fontWeight: '600' },
  picker: { borderWidth: 1, borderRadius: radius.md, padding: spacing.lg, gap: spacing.sm },
  pickerTitle: { fontSize: 16, fontWeight: '700' },
  pickerInput: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
  },
  pickerRow: { paddingVertical: spacing.sm, gap: 2 },
  pickerRowTitle: { fontSize: 16, fontWeight: '600' },
  pickerRowMeta: { fontSize: 13 },
  pickerCancel: { fontSize: 14, fontWeight: '600', marginTop: spacing.sm },
});
