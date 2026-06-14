import * as Haptics from 'expo-haptics';
import { ExternalLink, Sparkles } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows } from '@/constants/theme';
import { usePartners } from '@/context/PartnersContext';

interface SponsorRailProps {
  brandName: string;
  productLabel: string;
  tagline: string;
  logoUrl: string;
  cta?: string;
  searchQuery?: string;
  compact?: boolean;
}

export default function SponsorRail({
  brandName,
  productLabel,
  tagline,
  logoUrl,
  cta = 'Shop now',
  searchQuery,
  compact = false,
}: SponsorRailProps) {
  const { openBrandSearch } = usePartners();

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    void openBrandSearch(searchQuery ?? brandName, 'blinkit', { context: 'sponsor_rail' });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.card, compact && styles.cardCompact]}
    >
      <View style={styles.sponsorTag}>
        <Sparkles size={12} color={colors.primary} />
        <Text style={styles.sponsorTagText}>Sponsored</Text>
      </View>

      <View style={styles.body}>
        <Image source={{ uri: logoUrl }} style={styles.logo} resizeMode="contain" />
        <View style={styles.textCol}>
          <Text style={styles.brand}>{brandName}</Text>
          <Text style={styles.product}>{productLabel}</Text>
          <Text style={styles.tagline}>{tagline}</Text>
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
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 16,
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
    backgroundColor: colors.cream,
  },
  textCol: {
    flex: 1,
  },
  brand: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
  },
  product: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.charcoal,
    marginTop: 2,
  },
  tagline: {
    fontSize: 12,
    color: colors.muted,
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
