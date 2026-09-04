import * as Haptics from 'expo-haptics';
import { ExternalLink, Sparkles } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { usePartners } from '@/context/PartnersContext';
import { useTheme } from '@/context/ThemeContext';
import { logSponsorEvent } from '@/services/sponsorEvents';

interface SponsorRailProps {
  brandName: string;
  productLabel: string;
  tagline: string;
  logoUrl: string;
  placement: string;
  sponsorId?: string;
  cta?: string;
  searchQuery?: string;
  compact?: boolean;
}

export default function SponsorRail({
  brandName,
  productLabel,
  tagline,
  logoUrl,
  placement,
  sponsorId,
  cta = 'Shop now',
  searchQuery,
  compact = false,
}: SponsorRailProps) {
  const { openBrandSearch, groceryPartners } = usePartners();
  const primaryGroceryPartner = groceryPartners[0]?.id;
  const { userCity } = useAppContext();
  const { colors: themeColors, semantic, isDark } = useTheme();

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    void logSponsorEvent({
      eventType: 'tap',
      brandName,
      placement,
      sponsorId,
      partner: primaryGroceryPartner,
      query: searchQuery ?? brandName,
      city: userCity ?? undefined,
    });
    void openBrandSearch(searchQuery ?? brandName, primaryGroceryPartner, { context: 'sponsor_rail' });
  };

  const cardBorder = isDark ? 'rgba(255,255,255,0.28)' : themeColors.border;

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.card,
        compact && styles.cardCompact,
        {
          backgroundColor: themeColors.white,
          borderColor: cardBorder,
          borderWidth: isDark ? 1.5 : 1,
        },
      ]}
    >
      <View style={styles.sponsorTag}>
        <Sparkles size={12} color={colors.primary} />
        <Text style={styles.sponsorTagText}>Sponsored</Text>
      </View>

      <View style={styles.body}>
        <Image
          source={{ uri: logoUrl }}
          style={[
            styles.logo,
            {
              backgroundColor: semantic.surfaceMuted,
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : themeColors.border,
            },
          ]}
          resizeMode="contain"
        />
        <View style={styles.textCol}>
          <Text style={[styles.brand, { color: themeColors.muted }]}>{brandName}</Text>
          <Text style={[styles.product, { color: themeColors.charcoal }]}>{productLabel}</Text>
          <Text style={[styles.tagline, { color: themeColors.muted }]}>{tagline}</Text>
        </View>
        <View style={styles.ctaRow}>
          <Text style={styles.cta}>{cta}</Text>
          <ExternalLink size={14} color={colors.primary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: 16,
    ...shadows.card,
  },
  cardCompact: {
    marginBottom: 12,
    padding: 12,
  },
  sponsorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  sponsorTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  textCol: {
    flex: 1,
  },
  brand: {
    fontSize: 13,
    fontWeight: '700',
  },
  product: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  tagline: {
    fontSize: 12,
    marginTop: 4,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cta: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
