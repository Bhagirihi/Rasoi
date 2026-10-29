import { Check } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { appFonts } from "@/constants/fonts";
import { colors, radius, spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { parseRecipeSteps, type ParsedRecipeStep } from "@/utils/parseRecipeStep";

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
  themeColors: ReturnType<typeof useTheme>["colors"];
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
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.12)"
                  : colors.border,
              },
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
        <View style={styles.stepHeader}>
          <Text style={[styles.stepTitle, { color: themeColors.charcoal }]}>
            {step.title}
          </Text>
          {step.durationLabel ? (
            <Text style={[styles.stepDuration, { color: themeColors.muted }]}>
              {step.durationLabel}
            </Text>
          ) : null}
        </View>
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
          <View style={styles.tipBox}>
            <Text style={[styles.stepTip, { color: themeColors.muted }]}>
              <Text style={styles.stepTipLabel}>Tip · </Text>
              {step.tip}
            </Text>
          </View>
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
    flexDirection: "row",
    alignItems: "stretch",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  rail: {
    width: 32,
    alignItems: "center",
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  stepBadgeCook: {
    backgroundColor: colors.primary,
  },
  stepBadgeDone: {
    backgroundColor: colors.green,
  },
  stepBadgeText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 13,
    color: colors.white,
  },
  connector: {
    flex: 1,
    width: 2,
    marginTop: 4,
    marginBottom: -spacing.md,
    borderRadius: 1,
    opacity: 0.85,
  },
  stepBody: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.xs,
  },
  stepBodyCook: {
    paddingVertical: spacing.lg,
  },
  stepBodyDone: {
    opacity: 0.82,
    backgroundColor: "rgba(0,168,107,0.06)",
    borderColor: "rgba(0,168,107,0.25)",
  },
  stepHeader: {
    gap: 2,
  },
  stepTitle: {
    fontFamily: appFonts.bodyBold,
    fontSize: 16,
    lineHeight: 22,
  },
  stepDuration: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 12,
    fontStyle: "italic",
  },
  stepText: {
    fontFamily: appFonts.body,
    fontSize: 15,
    lineHeight: 23,
  },
  stepTextCook: {
    fontSize: 16,
    lineHeight: 25,
    fontFamily: appFonts.bodyMedium,
  },
  tipBox: {
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,107,53,0.15)",
  },
  stepTip: {
    fontFamily: appFonts.body,
    fontSize: 13,
    lineHeight: 20,
    fontStyle: "italic",
  },
  stepTipLabel: {
    fontFamily: appFonts.bodyBold,
    fontStyle: "normal",
    color: colors.primary,
  },
  empty: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.xl,
  },
  emptyText: {
    fontFamily: appFonts.body,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
});
