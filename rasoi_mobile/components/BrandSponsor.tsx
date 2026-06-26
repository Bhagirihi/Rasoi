import * as Haptics from 'expo-haptics';
import { ExternalLink, Sparkles } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { usePartners } from '@/context/PartnersContext';
import { useTheme } from '@/context/ThemeContext';
import { logSponsorEvent } from '@/services/sponsorEvents';

interface BrandSponsorProps {
  brandName: string;
  logoUrl: string;
  productLabel: string;
  tagline?: string;
  searchQuery?: string;
  placement?: string;
}

export default function BrandSponsor({
  brandName,
  logoUrl,
  productLabel,
  tagline = 'Recommended for this dish',
  searchQuery,
  placement = 'recipe',
}: BrandSponsorProps) {
  const { openBrandSearch, groceryPartners } = usePartners();
  const primaryGroceryPartner = groceryPartners[0]?.id;
  const { userCity } = useAppContext();
  const { colors: themeColors, semantic, isDark } = useTheme();
  const loggedImpressionRef = useRef(false);

  useEffect(() => {
    if (loggedImpressionRef.current) return;
    loggedImpressionRef.current = true;
    void logSponsorEvent({
      eventType: 'impression',
      brandName,
      placement,
      city: userCity ?? undefined,
    });
  }, [brandName, placement, userCity]);

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    void logSponsorEvent({
      eventType: 'tap',
      brandName,
      placement,
      partner: primaryGroceryPartner,
      query: searchQuery ?? brandName,
      city: userCity ?? undefined,
    });
    void openBrandSearch(searchQuery ?? brandName, primaryGroceryPartner, { context: 'brand_search' });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: semantic.surfaceMuted, borderColor: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(255,107,53,0.2)' },
        isDark && { borderWidth: 1.5 },
        pressed && { opacity: 0.92 },
      ]}
    >
      <View style={[styles.header, { backgroundColor: semantic.primarySoft }]}>
        <Sparkles size={14} color={colors.primary} />
        <Text style={styles.headerText}>Sponsored</Text>
        <ExternalLink size={12} color={colors.primary} style={styles.headerLink} />
      </View>

      <View style={styles.body}>
        <View
          style={[
            styles.logoWrap,
            {
              backgroundColor: themeColors.white,
              borderColor: isDark ? 'rgba(255,255,255,0.22)' : themeColors.border,
            },
          ]}
        >
          <Image source={{ uri: logoUrl }} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.textWrap}>
          <Text style={[styles.productLabel, { color: themeColors.charcoal }]}>{productLabel}</Text>
          <Text style={[styles.tagline, { color: themeColors.muted }]}>{tagline}</Text>
          <Text style={styles.brandName}>Shop {brandName} on Blinkit</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 16,
    overflow: 'hidden',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.2)',
    backgroundColor: colors.cream,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,107,53,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  headerLink: {
    marginLeft: 'auto',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  logoWrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 14,
  },
  logo: {
    width: 40,
    height: 40,
  },
  textWrap: {
    flex: 1,
  },
  productLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.charcoal,
  },
  tagline: {
    marginTop: 2,
    fontSize: 13,
    color: colors.muted,
  },
  brandName: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    color: colors.green,
  },
});
