import { useFocusEffect, useRouter } from 'expo-router';
import { Check, ShoppingCart } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Linking, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppTabHeader } from '@/components/AppTabHeader';
import OfflineBanner from '@/components/OfflineBanner';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import { EmptyState, PrimaryButton } from '@/components/ui/Primitives';
import { layout, radius, scrollIndicator, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import {
  buildGroceryCheckoutQuery,
  buildPartnerUrls,
  loadPartnerLinks,
  type PartnerLinkResponse,
} from '@/services/partners';
import {
  getGroceryList,
  getWeekStartString,
  rebuildGroceryList,
  setGroceryItemChecked,
  type GroceryItem,
} from '@/services/planner';

type SectionGroup = { section: string; items: GroceryItem[] };

export default function GroceryTab() {
  const router = useRouter();
  const { colors: themeColors, screenBackground } = useTheme();
  const weekStart = useMemo(() => getWeekStartString(), []);

  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partners, setPartners] = useState<PartnerLinkResponse[]>([]);

  const load = useCallback(async () => {
    try {
      setError(null);
      const result = await getGroceryList(weekStart);
      setItems(result.items);
      const links = await loadPartnerLinks().catch(() => []);
      setPartners(links.filter((link) => link.category === 'grocery'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load your grocery list');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [weekStart]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const groups = useMemo<SectionGroup[]>(() => {
    const map = new Map<string, GroceryItem[]>();
    for (const item of items) {
      const list = map.get(item.section) ?? [];
      list.push(item);
      map.set(item.section, list);
    }
    return [...map.entries()].map(([section, sectionItems]) => ({ section, items: sectionItems }));
  }, [items]);

  const checkedCount = items.filter((item) => item.checked).length;
  const uncheckedNames = items.filter((item) => !item.checked).map((item) => item.name);

  async function handleToggle(item: GroceryItem) {
    const next = !item.checked;
    setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, checked: next } : entry)));
    try {
      await setGroceryItemChecked(item.id, next);
    } catch {
      setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, checked: item.checked } : entry)));
    }
  }

  async function handleRebuild() {
    setRebuilding(true);
    try {
      const result = await rebuildGroceryList(weekStart);
      setItems(result.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not rebuild your grocery list');
    } finally {
      setRebuilding(false);
    }
  }

  async function handleShop(partnerId: string) {
    const query = buildGroceryCheckoutQuery(uncheckedNames);
    if (!query) return;
    const urls = buildPartnerUrls(partnerId, query, partners);
    if (!urls) return;
    try {
      await Linking.openURL(urls.deepLink);
    } catch {
      await Linking.openURL(urls.webUrl);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: screenBackground }]} edges={['top']}>
      <OfflineBanner />
      <ScrollViewWithFloatingIndicator
        {...scrollIndicator}
        style={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              void load();
            }}
            tintColor={themeColors.primary}
            colors={[themeColors.primary]}
          />
        }
        contentContainerStyle={[styles.content, { paddingBottom: layout.tabBarExtra }]}
      >
        <AppTabHeader compact eyebrow="Grocery list" />

        {!loading && !error && items.length > 0 && (
          <View style={[styles.progressCard, { backgroundColor: themeColors.white, borderColor: themeColors.border }]}>
            <ShoppingCart size={24} color={themeColors.primary} />
            <View style={styles.progressText}>
              <Text style={[styles.progressTitle, { color: themeColors.charcoal }]}>
                {checkedCount} of {items.length} bought
              </Text>
              <Text style={[styles.progressCaption, { color: themeColors.muted }]}>
                Built from this week's planned meals, minus your pantry.
              </Text>
            </View>
          </View>
        )}

        {!loading && !error && items.length === 0 && (
          <View>
            <EmptyState
              icon={ShoppingCart}
              title="No grocery list yet"
              subtitle="Plan meals for this week first, then everything you still need to buy shows up here."
            />
            <PrimaryButton label="Plan my week" onPress={() => router.push('/planner-week')} />
          </View>
        )}

        {!loading && !error && items.length > 0 && (
          <View style={styles.sections}>
            {groups.map((group) => (
              <View key={group.section}>
                <Text style={[styles.sectionTitle, { color: themeColors.charcoal }]}>{group.section}</Text>
                <View style={[styles.sectionCard, { backgroundColor: themeColors.white, borderColor: themeColors.border }]}>
                  {group.items.map((item) => (
                    <Pressable
                      key={item.id}
                      onPress={() => void handleToggle(item)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: item.checked }}
                      style={styles.row}
                    >
                      <View
                        style={[
                          styles.checkCircle,
                          {
                            borderColor: item.checked ? themeColors.primary : themeColors.border,
                            backgroundColor: item.checked ? themeColors.primary : 'transparent',
                          },
                        ]}
                      >
                        {item.checked && <Check size={16} color="#FFFFFF" />}
                      </View>
                      <Text
                        style={[
                          styles.rowName,
                          {
                            color: item.checked ? themeColors.muted : themeColors.charcoal,
                            textDecorationLine: item.checked ? 'line-through' : 'none',
                          },
                        ]}
                      >
                        {item.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {!loading && !error && items.length > 0 && (
          <View style={styles.actions}>
            <PrimaryButton label={rebuilding ? 'Rebuilding…' : 'Rebuild list'} onPress={() => void handleRebuild()} disabled={rebuilding} />
            <Text style={[styles.note, { color: themeColors.muted }]}>
              Items are listed by name — recipe data has no quantities yet, so no amounts are shown.
            </Text>
            {uncheckedNames.length > 0 && partners.length > 0 && (
              <View style={styles.shopBlock}>
                <Text style={[styles.shopTitle, { color: themeColors.charcoal }]}>Shop the rest</Text>
                <Text style={[styles.shopCaption, { color: themeColors.muted }]}>
                  Partner apps take one search term, so shopping opens for “{uncheckedNames[0]}” — the rest stays checked off here.
                </Text>
                {partners.slice(0, 4).map((partner) => (
                  <Pressable
                    key={partner.partnerId}
                    onPress={() => void handleShop(partner.partnerId)}
                    style={[styles.shopButton, { borderColor: themeColors.border, backgroundColor: themeColors.white }]}
                  >
                    <Text style={[styles.shopButtonText, { color: themeColors.charcoal }]}>{partner.label}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}

        {!loading && error && (
          <View>
            <EmptyState icon={ShoppingCart} title="Could not load your grocery list" subtitle={error} />
            <PrimaryButton
              label="Try again"
              onPress={() => {
                setLoading(true);
                void load();
              }}
            />
          </View>
        )}
      </ScrollViewWithFloatingIndicator>
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
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  progressText: { flex: 1, gap: 2 },
  progressTitle: { fontSize: 16, fontWeight: '600' },
  progressCaption: { fontSize: 13, lineHeight: 19 },
  sections: { gap: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },
  sectionCard: { borderWidth: 1, borderRadius: radius.md, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 60,
    paddingHorizontal: spacing.lg,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowName: { fontSize: 16, flex: 1 },
  actions: { gap: spacing.md },
  note: { fontSize: 13, lineHeight: 19 },
  shopBlock: { gap: spacing.sm, marginTop: spacing.sm },
  shopTitle: { fontSize: 16, fontWeight: '700' },
  shopCaption: { fontSize: 13, lineHeight: 19 },
  shopButton: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  shopButtonText: { fontSize: 16, fontWeight: '600' },
});
