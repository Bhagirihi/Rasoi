import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { parseRecipeSteps, type ParsedRecipeStep } from '@/utils/parseRecipeStep';

type RecipeMethodTimelineProps = {
  title: string;
  steps: string[];
  prepTime: number;
  cookMode?: boolean;
  completedSteps?: Set<number>;
  onToggleStep?: (index: number) => void;
};

function StepCard({
  step,
  index,
  isLast,
  cookMode,
  done,
  onToggle,
  themeColors,
  isDark,
}: {
  step: ParsedRecipeStep;
  index: number;
  isLast: boolean;
  cookMode?: boolean;
  done?: boolean;
  onToggle?: () => void;
  themeColors: ReturnType<typeof useTheme>['colors'];
  isDark: boolean;
}) {
  const content = (
    <View style={styles.stepRow}>
      <View style={styles.rail}>
        <View
          style={[
            styles.stepBadge,
            done && styles.stepBadgeDone,
            cookMode && !done && styles.stepBadgeCook,
          ]}
        >
          {done ? (
            <Check size={14} color={colors.white} strokeWidth={3} />
          ) : (
            <Text style={styles.stepBadgeText}>{index + 1}</Text>
          )}
        </View>
        {!isLast ? (
          <View
            style={[
              styles.connector,
              { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : colors.border },
            ]}
          />
        ) : null}
      </View>

      <View
        style={[
          styles.stepBody,
          {
            backgroundColor: themeColors.white,
            borderColor: themeColors.border,
          },
          done && styles.stepBodyDone,
          cookMode && styles.stepBodyCook,
        ]}
      >
        <Text style={[styles.stepTitle, { color: themeColors.charcoal }]}>
          {step.title}
        </Text>
        {step.durationLabel ? (
          <Text style={[styles.stepDuration, { color: themeColors.muted }]}>
            {step.durationLabel}
          </Text>
        ) : null}
        <Text
          style={[
            styles.stepText,
            { color: themeColors.charcoal },
            cookMode && styles.stepTextCook,
          ]}
        >
          {step.body}
        </Text>
        {step.tip ? (
          <Text style={[styles.stepTip, { color: themeColors.muted }]}>
            <Text style={styles.stepTipLabel}>Pro tip: </Text>
            {step.tip}
          </Text>
        ) : null}
      </View>
    </View>
  );

  if (cookMode && onToggle) {
    return (
      <Pressable onPress={onToggle} accessibilityRole="button">
        {content}
      </Pressable>
    );
  }

  return content;
}

export default function RecipeMethodTimeline({
  title,
  steps,
  prepTime,
  cookMode = false,
  completedSteps,
  onToggleStep,
}: RecipeMethodTimelineProps) {
  const { colors: themeColors, isDark } = useTheme();
  const parsedSteps = parseRecipeSteps(steps, prepTime);

  if (parsedSteps.length === 0) {
    return (
      <View
        style={[
          styles.empty,
          {
            backgroundColor: themeColors.white,
            borderColor: themeColors.border,
          },
        ]}
      >
        <Text style={[styles.emptyText, { color: themeColors.muted }]}>
          Cooking steps coming soon for {title}.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {parsedSteps.map((step, index) => (
        <StepCard
          key={`${index}-${step.title}`}
          step={step}
          index={index}
          isLast={index === parsedSteps.length - 1}
          cookMode={cookMode}
          done={completedSteps?.has(index)}
          onToggle={onToggleStep ? () => onToggleStep(index) : undefined}
          themeColors={themeColors}
          isDark={isDark}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 0,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  rail: {
    width: 32,
    alignItems: 'center',
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  stepBadgeCook: {
    backgroundColor: colors.primary,
  },
  stepBadgeDone: {
    backgroundColor: colors.green,
  },
  stepBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.white,
  },
  connector: {
    flex: 1,
    width: 2,
    marginTop: 4,
    marginBottom: -spacing.lg,
    borderRadius: 1,
    opacity: 0.85,
  },
  stepBody: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  stepBodyCook: {
    paddingVertical: spacing.xl,
  },
  stepBodyDone: {
    opacity: 0.78,
    backgroundColor: 'rgba(0,168,107,0.06)',
    borderColor: 'rgba(0,168,107,0.25)',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    color: colors.charcoal,
  },
  stepDuration: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  stepText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.charcoal,
  },
  stepTextCook: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '500',
  },
  stepTip: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
    color: colors.muted,
  },
  stepTipLabel: {
    fontWeight: '800',
    fontStyle: 'normal',
  },
  empty: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    color: colors.muted,
  },
});
