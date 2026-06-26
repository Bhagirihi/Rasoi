import * as Haptics from 'expo-haptics';
import { Package, ShoppingCart } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { usePartners } from '@/context/PartnersContext';
import type { AffiliatePartner } from '@/utils/affiliate';

interface MissingItemsPanelProps {
  missing: string[];
  totalCount: number;
  onShopAll?: () => void;
  onPartnerPress?: (partner: AffiliatePartner) => void;
  title?: string;
}

export default function MissingItemsPanel({
  missing,
  totalCount,
  onShopAll,
  onPartnerPress,
  title = 'Need to buy',
}: MissingItemsPanelProps) {
  const { colors: themeColors } = useTheme();
  const { groceryPartners } = usePartners();

  if (missing.length === 0) {
    return (
      <View style={styles.allSetCard}>
        <View style={styles.allSetIcon}>
          <Package size={20} color={colors.green} />
        </View>
        <View style={styles.allSetText}>
          <Text style={styles.allSetTitle}>Pantry complete</Text>
          <Text style={[styles.allSetSub, { color: themeColors.muted }]}>You have every ingredient — happy cooking!</Text>
        </View>
      </View>
    );
  }

  const stockedCount = totalCount - missing.length;
  const progress = totalCount > 0 ? stockedCount / totalCount : 0;
  const partnerHint =
    groceryPartners.length > 0
      ? groceryPartners.map((partner) => partner.label).join(' · ')
      : 'Partner checkout';

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: themeColors.white, borderColor: 'rgba(255,107,53,0.28)' },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconWrap}>
            <ShoppingCart size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.title, { color: themeColors.charcoal }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: themeColors.muted }]}>
              {missing.length} item{missing.length !== 1 ? 's' : ''} to order
            </Text>
          </View>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countPillText}>{missing.length}</Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
      <Text style={[styles.progressLabel, { color: themeColors.muted }]}>
        {stockedCount} of {totalCount} ingredients in your pantry
      </Text>

      <View style={styles.chipGrid}>
        {missing.map((item) => (
          <View key={item} style={styles.chip}>
            <View style={styles.chipDot} />
            <Text style={[styles.chipText, { color: themeColors.charcoal }]}>{item}</Text>
          </View>
        ))}
      </View>

      {onShopAll && (
        <Pressable
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onShopAll();
          }}
          style={({ pressed }) => [styles.shopBtn, pressed && { opacity: 0.9 }]}
        >
          <ShoppingCart size={18} color={colors.white} />
          <Text style={styles.shopBtnText}>Order all missing items</Text>
        </Pressable>
      )}

      {onPartnerPress && groceryPartners.length > 0 ? (
        <View style={styles.partnerRow}>
          {groceryPartners.map((partner) => (
            <Pressable
              key={partner.id}
              onPress={() => {
                void Haptics.selectionAsync();
                onPartnerPress(partner.id);
              }}
              style={[
                styles.partnerChip,
                { backgroundColor: themeColors.white, borderColor: `${partner.accent}55` },
              ]}
            >
              <View style={[styles.partnerAccent, { backgroundColor: partner.accent }]} />
              <Text style={[styles.partnerLabel, { color: themeColors.charcoal }]} numberOfLines={1}>
                {partner.label}
              </Text>
              <Text style={[styles.partnerEta, { color: themeColors.muted }]} numberOfLines={1}>
                {partner.delivery.replace('~', '')}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <Text style={[styles.partnerHint, { color: themeColors.muted }]}>{partnerHint}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.28)',
    backgroundColor: colors.white,
    padding: spacing.lg,
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,107,53,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.charcoal,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: colors.muted,
  },
  countPill: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  countPillText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,107,53,0.12)',
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  progressLabel: {
    marginTop: spacing.sm,
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,107,53,0.45)',
    backgroundColor: 'rgba(255,107,53,0.06)',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.charcoal,
  },
  shopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    ...shadows.cta,
  },
  shopBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
  },
  partnerHint: {
    marginTop: spacing.sm,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
  },
  partnerRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: spacing.md,
  },
  partnerChip: {
    flex: 1,
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  partnerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  partnerLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '800',
    color: colors.charcoal,
  },
  partnerEta: {
    marginTop: 1,
    fontSize: 9,
    fontWeight: '600',
    color: colors.muted,
  },
  allSetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,168,107,0.25)',
    backgroundColor: 'rgba(0,168,107,0.06)',
    padding: spacing.lg,
  },
  allSetIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(0,168,107,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allSetText: { flex: 1 },
  allSetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.green,
  },
  allSetSub: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
});
