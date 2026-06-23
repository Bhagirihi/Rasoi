import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { ChevronRight, LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import {
  Linking,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { usePartners } from '@/context/PartnersContext';
import { useTheme } from '@/context/ThemeContext';
import { colors, layout, radius, shadows, spacing } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { CONTACT_EMAIL, CONTACT_MAILTO, SITE_BASE_URL } from '@/constants/links';
import { DAILY_REMINDER_TIME_LABEL } from '@/utils/notifications';

const LEGAL_BASE_URL = SITE_BASE_URL;
const APP_VERSION = Constants.expoConfig?.version ?? '1.0.3';

function openLegalUrl(path: '/privacy' | '/terms') {
  void Linking.openURL(`${LEGAL_BASE_URL}${path}`);
}

export function SettingsSubHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  const { colors: themeColors } = useTheme();

  return (
    <View style={styles.subHeader}>
      <Pressable onPress={onBack} style={styles.subBack} hitSlop={10}>
        <ChevronRight
          size={22}
          color={themeColors.charcoal}
          style={{ transform: [{ rotate: '180deg' }] }}
        />
      </Pressable>
      <Text style={[styles.subTitle, { color: themeColors.charcoal }]}>{title}</Text>
      <View style={styles.subBack} />
    </View>
  );
}

export function SettingsGroupLabel({
  label,
  action,
  onAction,
}: {
  label: string;
  action?: string;
  onAction?: () => void;
}) {
  const { colors: themeColors } = useTheme();

  return (
    <View style={styles.groupHeader}>
      <Text style={[styles.groupLabel, { color: themeColors.muted }]}>{label}</Text>
      {action && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.groupAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function KitchenPrefsCard({
  dietLabel,
  dietIcon: DietIcon,
  dietTint,
  dietBg,
  region,
  cuisineLabels,
  notificationsEnabled,
  onEdit,
  onNotificationsChange,
}: {
  dietLabel: string;
  dietIcon: LucideIcon;
  dietTint: string;
  dietBg: string;
  region: string;
  cuisineLabels: string[];
  notificationsEnabled: boolean;
  onEdit: () => void;
  onNotificationsChange: (next: boolean) => void;
}) {
  const { colors: themeColors } = useTheme();

  return (
    <View
      style={[
        styles.kitchenCard,
        { backgroundColor: themeColors.white, borderColor: themeColors.border },
      ]}
    >
      <Pressable onPress={onEdit} style={({ pressed }) => [pressed && styles.rowPressed]}>
        <View style={styles.kitchenTop}>
          <View style={[styles.kitchenDietBadge, { backgroundColor: dietBg }]}>
            <DietIcon size={16} color={dietTint} />
            <Text style={[styles.kitchenDietText, { color: dietTint }]}>{dietLabel}</Text>
          </View>
          <View
            style={[
              styles.kitchenRegionPill,
              { backgroundColor: themeColors.cream, borderColor: themeColors.border },
            ]}
          >
            <Text style={[styles.kitchenRegionText, { color: themeColors.charcoal }]}>{region}</Text>
          </View>
        </View>

        <Text style={[styles.kitchenCuisineTitle, { color: themeColors.muted }]}>Favourite cuisines</Text>
        <View style={styles.kitchenChipWrap}>
          {cuisineLabels.length > 0 ? (
            cuisineLabels.map((label) => (
              <View key={label} style={styles.kitchenChip}>
                <Text style={styles.kitchenChipText}>{label}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.kitchenEmpty, { color: themeColors.muted }]}>Tap to pick cuisines</Text>
          )}
        </View>
      </Pressable>

      <View
        style={[
          styles.kitchenNotify,
          { backgroundColor: themeColors.cream },
          notificationsEnabled && styles.kitchenNotifyOn,
        ]}
      >
        <View style={styles.kitchenNotifyLeft}>
          <Text style={[styles.kitchenNotifyLabel, { color: themeColors.charcoal }]}>Daily reminders</Text>
          <Text style={[styles.kitchenNotifySub, { color: themeColors.muted }]}>
            {notificationsEnabled
              ? `${DAILY_REMINDER_TIME_LABEL} dinner nudges are on`
              : 'Off — tap to enable'}
          </Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={onNotificationsChange}
          trackColor={{ false: themeColors.border, true: 'rgba(0,168,107,0.35)' }}
          thumbColor={notificationsEnabled ? colors.green : themeColors.white}
        />
      </View>
    </View>
  );
}

export function AccountActionsCard({
  isGuest,
  onSignIn,
  onSwitchAccount,
  onLogout,
  onReset,
}: {
  isGuest: boolean;
  onSignIn: () => void;
  onSwitchAccount: () => void;
  onLogout: () => void;
  onReset: () => void;
}) {
  const { colors: themeColors } = useTheme();

  if (isGuest) {
    return (
      <View style={styles.accountWrap}>
        <Pressable
          onPress={onSignIn}
          style={({ pressed }) => [styles.accountSignInCard, pressed && styles.rowPressed]}
        >
          <LinearGradient
            colors={[colors.green, '#00C896']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.accountSignInGradient}
          >
            <View style={styles.accountSignInText}>
              <Text style={styles.accountSignInTitle}>Sign in to Rasoi</Text>
              <Text style={styles.accountSignInSub}>
                Save recipes with your name & mobile
              </Text>
            </View>
            <View style={styles.accountSignInArrow}>
              <ChevronRight size={20} color={colors.white} />
            </View>
          </LinearGradient>
        </Pressable>
        {__DEV__ ? (
          <Pressable onPress={onReset} style={styles.accountResetLink}>
            <Text style={[styles.accountResetText, { color: themeColors.muted }]}>Reset full flow (testing)</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.accountWrap}>
      <View style={styles.accountBtnRow}>
        <Pressable
          onPress={onSwitchAccount}
          style={({ pressed }) => [styles.accountBtn, styles.accountBtnPrimary, pressed && styles.rowPressed]}
        >
          <Text style={styles.accountBtnPrimaryText}>Switch account</Text>
          <Text style={styles.accountBtnPrimarySub}>Different number</Text>
        </Pressable>
        <Pressable
          onPress={onLogout}
          testID={testIds.settingsLogout}
          style={({ pressed }) => [
            styles.accountBtn,
            styles.accountBtnOutline,
            { backgroundColor: themeColors.white, borderColor: themeColors.border },
            pressed && styles.rowPressed,
          ]}
        >
          <Text style={styles.accountBtnOutlineText}>Log out</Text>
          <Text style={[styles.accountBtnOutlineSub, { color: themeColors.muted }]}>Return to login</Text>
        </Pressable>
      </View>
      {__DEV__ ? (
        <Pressable onPress={onReset} style={styles.accountResetLink}>
          <Text style={[styles.accountResetText, { color: themeColors.muted }]}>Reset full flow (testing)</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function SettingsCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors: themeColors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: themeColors.white, borderColor: themeColors.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function SettingsNavRow({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  onPress,
  destructive = false,
  isLast = false,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  value?: string;
  onPress: () => void;
  destructive?: boolean;
  isLast?: boolean;
}) {
  const { colors: themeColors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !isLast && [styles.rowBorder, { borderBottomColor: themeColors.border }],
        pressed && styles.rowPressed,
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
        <Icon size={18} color={iconColor} />
      </View>
      <View style={styles.rowBody}>
        <Text style={[styles.rowLabel, { color: themeColors.charcoal }, destructive && styles.destructiveText]}>
          {label}
        </Text>
        {value ? (
          <Text style={[styles.rowValue, { color: themeColors.muted }]} numberOfLines={2}>
            {value}
          </Text>
        ) : null}
      </View>
      <ChevronRight size={18} color={themeColors.muted} />
    </Pressable>
  );
}

export function SettingsToggleRow({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  subtitle,
  value,
  onValueChange,
  isLast = false,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  subtitle: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  isLast?: boolean;
}) {
  const { colors: themeColors } = useTheme();

  return (
    <View style={[styles.row, !isLast && [styles.rowBorder, { borderBottomColor: themeColors.border }]]}>
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
        <Icon size={18} color={iconColor} />
      </View>
      <View style={styles.rowBody}>
        <Text style={[styles.rowLabel, { color: themeColors.charcoal }]}>{label}</Text>
        <Text style={[styles.rowValue, { color: themeColors.muted }]}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: themeColors.border, true: 'rgba(0,168,107,0.35)' }}
        thumbColor={value ? colors.green : themeColors.white}
      />
    </View>
  );
}

export function SettingsProfileHero({
  name,
  subtitle,
  initial,
  isGuest,
  onPress,
}: {
  name: string;
  subtitle: string;
  initial: string;
  isGuest: boolean;
  onPress: () => void;
}) {
  const { colors: themeColors, semantic } = useTheme();
  const heroGradient = (
    isGuest
      ? [semantic.primarySoft, semantic.surface]
      : [semantic.surface, semantic.surfaceMuted]
  ) as [string, string];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.92 }]}>
      <LinearGradient
        colors={heroGradient}
        style={[
          styles.hero,
          { borderColor: themeColors.border },
          isGuest && styles.heroGuest,
        ]}
      >
        <View style={styles.heroTopAccent} />
        <View style={styles.heroContent}>
          <View style={[styles.avatar, isGuest && styles.avatarGuest]}>
            <Text style={styles.avatarLetter}>{initial}</Text>
          </View>
          <View style={styles.heroText}>
            <Text style={[styles.heroName, { color: themeColors.charcoal }]}>{name}</Text>
            <Text style={[styles.heroSub, { color: themeColors.muted }]}>{subtitle}</Text>
          </View>
          <View style={[styles.heroPill, isGuest && styles.heroPillGuest]}>
            <Text style={[styles.heroPillText, isGuest && styles.heroPillTextGuest]}>
              {isGuest ? 'Sign in' : 'Edit'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export function SettingsQuickTile({
  label,
  sublabel,
  icon: Icon,
  onPress,
}: {
  label: string;
  sublabel: string;
  icon: LucideIcon;
  onPress: () => void;
}) {
  const { colors: themeColors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: themeColors.white, borderColor: themeColors.border },
        pressed && styles.rowPressed,
      ]}
    >
      <View style={styles.tileIcon}>
        <Icon size={20} color={colors.primary} />
      </View>
      <Text style={[styles.tileLabel, { color: themeColors.charcoal }]}>{label}</Text>
      <Text style={[styles.tileSub, { color: themeColors.muted }]}>{sublabel}</Text>
    </Pressable>
  );
}

export function PartnerStrip() {
  const { groceryPartners } = usePartners();
  const { colors: themeColors } = useTheme();

  return (
    <View style={styles.partnerRow}>
      {groceryPartners.map((partner) => (
        <View
          key={partner.id}
          style={[
            styles.partnerChip,
            { backgroundColor: themeColors.cream, borderColor: themeColors.border },
          ]}
        >
          <View style={[styles.partnerDot, { backgroundColor: partner.accent }]} />
          <Text style={[styles.partnerLabel, { color: themeColors.charcoal }]}>{partner.label}</Text>
        </View>
      ))}
    </View>
  );
}

function openContactEmail() {
  void Linking.openURL(CONTACT_MAILTO);
}

export function SettingsFooter() {
  const { colors: themeColors } = useTheme();

  return (
    <View style={styles.footerWrap}>
      <View style={styles.footerLinks}>
        <Pressable onPress={() => openLegalUrl('/privacy')} hitSlop={8}>
          <Text style={[styles.footerLink, { color: themeColors.primary }]}>Privacy Policy</Text>
        </Pressable>
        <Text style={[styles.footerDot, { color: themeColors.muted }]}>·</Text>
        <Pressable onPress={() => openLegalUrl('/terms')} hitSlop={8}>
          <Text style={[styles.footerLink, { color: themeColors.primary }]}>Terms</Text>
        </Pressable>
        <Text style={[styles.footerDot, { color: themeColors.muted }]}>·</Text>
        <Pressable onPress={openContactEmail} hitSlop={8}>
          <Text style={[styles.footerLink, { color: themeColors.primary }]}>{CONTACT_EMAIL}</Text>
        </Pressable>
      </View>
      <Text style={[styles.footer, { color: themeColors.muted }]}>
        Rasoi v{APP_VERSION} · Made for Indian home cooks
      </Text>
    </View>
  );
}

export function getProfileInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed || trimmed === 'Guest') return 'G';
  return trimmed.charAt(0).toUpperCase();
}

const styles = StyleSheet.create({
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.sm,
  },
  subBack: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.charcoal,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  groupAction: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  kitchenCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.card,
  },
  kitchenTop: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  kitchenDietBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  kitchenDietText: {
    fontSize: 13,
    fontWeight: '800',
  },
  kitchenRegionPill: {
    borderRadius: radius.pill,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  kitchenRegionText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.charcoal,
  },
  kitchenCuisineTitle: {
    marginTop: spacing.lg,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  kitchenChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
    minHeight: 28,
  },
  kitchenChip: {
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,107,53,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  kitchenChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  kitchenEmpty: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.muted,
  },
  kitchenNotify: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.cream,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  kitchenNotifyOn: {
    backgroundColor: 'rgba(0,168,107,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0,168,107,0.15)',
  },
  kitchenNotifyLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  kitchenNotifyLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.charcoal,
  },
  kitchenNotifySub: {
    marginTop: 2,
    fontSize: 12,
    color: colors.muted,
  },
  accountWrap: {
    gap: spacing.md,
  },
  accountSignInCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.cardLifted,
  },
  accountSignInGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  accountSignInText: {
    flex: 1,
  },
  accountSignInTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.white,
  },
  accountSignInSub: {
    marginTop: spacing.xs,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.85)',
  },
  accountSignInArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountBtnRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  accountBtn: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    ...shadows.card,
  },
  accountBtnPrimary: {
    backgroundColor: colors.charcoal,
  },
  accountBtnPrimaryText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
  },
  accountBtnPrimarySub: {
    marginTop: 4,
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
  },
  accountBtnOutline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accountBtnOutlineText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.danger,
  },
  accountBtnOutlineSub: {
    marginTop: 4,
    fontSize: 11,
    color: colors.muted,
  },
  accountResetLink: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
  },
  accountResetText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    textDecorationLine: 'underline',
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowPressed: {
    backgroundColor: 'rgba(0,0,0,0.025)',
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowBody: {
    flex: 1,
    marginRight: spacing.sm,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.charcoal,
  },
  rowValue: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  destructiveText: {
    color: colors.danger,
  },
  hero: {
    marginTop: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.cardLifted,
  },
  heroGuest: {
    borderColor: 'rgba(255,107,53,0.3)',
  },
  heroTopAccent: {
    height: 4,
    backgroundColor: colors.primary,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarGuest: {
    backgroundColor: colors.primary,
  },
  avatarLetter: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
  },
  heroText: {
    flex: 1,
  },
  heroName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.charcoal,
  },
  heroSub: {
    marginTop: spacing.xs,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  heroPill: {
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,107,53,0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  heroPillGuest: {
    backgroundColor: colors.primary,
  },
  heroPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  heroPillTextGuest: {
    color: colors.white,
  },
  tile: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md + 2,
    ...shadows.card,
  },
  tileIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,107,53,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  tileLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.charcoal,
  },
  tileSub: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 15,
    color: colors.muted,
  },
  partnerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  partnerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  partnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  partnerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.charcoal,
  },
  footerWrap: {
    marginTop: spacing.xxxl,
    marginBottom: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  footerDot: {
    fontSize: 12,
    color: colors.muted,
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.muted,
  },
});
