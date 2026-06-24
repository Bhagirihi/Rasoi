import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors, radius, shadows, spacing } from "@/constants/theme";

type Phase = "intro" | "checking" | "rasoi";
type TextAlignSide = "left" | "right" | "center";

type HomeHeroLoadingBoxProps = {
  dataReady: boolean;
  hasError?: boolean;
  isLateNight?: boolean;
  onFinished: () => void;
};

const INTRO_MS = __DEV__ ? 2000 : 650;
const CHECKING_MS = __DEV__ ? 1000 : 450;
const RASOI_HOLD_MS = __DEV__ ? 2000 : 280;

const INTRO_LINES = [
  "Are aap aa gaye....",
  "Aaj khane me kya banau??",
  "Kuch bhi banalo",
  "Ruko dekhte he!!",
];

const MAX_INTRO_LINES = __DEV__ ? INTRO_LINES.length : 2;

const CHECKING_LINES = [
  "Pantry check kar rahe hain...",
  "Aapki desire check kar rahe hain...",
  "Saved items check kar rahe hain...",
  "Best picks dhoondh rahe hain...",
];

const RASOI_LINE = "Rasoi hai na.";
const RASOI_SUB = "Chalo, aapke picks ready hain.";

function introSide(index: number): TextAlignSide {
  return index % 2 === 0 ? "left" : "right";
}

function CheckingDots() {
  const dot1 = useRef(new Animated.Value(0.35)).current;
  const dot2 = useRef(new Animated.Value(0.35)).current;
  const dot3 = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulse = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 420,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0.35,
            duration: 420,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      );

    const a1 = pulse(dot1, 0);
    const a2 = pulse(dot2, 140);
    const a3 = pulse(dot3, 280);
    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.checkingDots}>
      {[dot1, dot2, dot3].map((opacity, index) => (
        <Animated.View key={index} style={[styles.checkingDot, { opacity }]} />
      ))}
    </View>
  );
}

export default function HomeHeroLoadingBox({
  dataReady,
  hasError = false,
  isLateNight = false,
  onFinished,
}: HomeHeroLoadingBoxProps) {
  const [phase, setPhase] = useState<Phase>(() =>
    dataReady ? "rasoi" : "intro",
  );
  const [introIndex, setIntroIndex] = useState(0);
  const [checkingIndex, setCheckingIndex] = useState(0);

  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateX = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(0)).current;
  const rasoiScale = useRef(new Animated.Value(0.88)).current;
  const rasoiOpacity = useRef(new Animated.Value(0)).current;
  const rasoiSubOpacity = useRef(new Animated.Value(0)).current;
  const rasoiSubTranslateY = useRef(new Animated.Value(10)).current;
  const rasoiPulse = useRef(new Animated.Value(1)).current;

  const finishedRef = useRef(false);
  const rasoiEnteredAtRef = useRef<number | null>(null);
  const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const dataReadyRef = useRef(dataReady);
  const onFinishedRef = useRef(onFinished);
  dataReadyRef.current = dataReady;
  onFinishedRef.current = onFinished;

  const introLine = INTRO_LINES[introIndex] ?? INTRO_LINES[0];
  const checkingLine =
    CHECKING_LINES[checkingIndex % CHECKING_LINES.length] ?? CHECKING_LINES[0];

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    pulseLoopRef.current?.stop();
    onFinishedRef.current();
  }, []);

  const goToRasoi = useCallback(() => {
    setPhase((current) => (current === "rasoi" ? current : "rasoi"));
  }, []);

  const animateIntroOrChecking = useCallback(
    (side: TextAlignSide) => {
      textOpacity.setValue(0);

      if (side === "center") {
        textTranslateX.setValue(0);
        textTranslateY.setValue(18);
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 360,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.spring(textTranslateY, {
            toValue: 0,
            friction: 7,
            tension: 90,
            useNativeDriver: true,
          }),
        ]).start();
        return;
      }

      const slideX = side === "left" ? -40 : 40;
      const slideY = side === "left" ? -20 : 20;
      textTranslateX.setValue(slideX);
      textTranslateY.setValue(slideY);
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateX, {
          toValue: 0,
          friction: 7,
          tension: 85,
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateY, {
          toValue: 0,
          friction: 7,
          tension: 85,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [textOpacity, textTranslateX, textTranslateY],
  );

  const animateRasoiIn = useCallback(() => {
    rasoiScale.setValue(0.88);
    rasoiOpacity.setValue(0);
    rasoiSubOpacity.setValue(0);
    rasoiSubTranslateY.setValue(12);
    rasoiPulse.setValue(1);

    Animated.parallel([
      Animated.spring(rasoiScale, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(rasoiOpacity, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(180),
      Animated.parallel([
        Animated.timing(rasoiSubOpacity, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(rasoiSubTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    pulseLoopRef.current?.stop();
    pulseLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(rasoiPulse, {
          toValue: 1.025,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rasoiPulse, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoopRef.current.start();
  }, [
    rasoiOpacity,
    rasoiPulse,
    rasoiScale,
    rasoiSubOpacity,
    rasoiSubTranslateY,
  ]);

  useEffect(() => {
    if (phase === "intro") {
      animateIntroOrChecking(introSide(introIndex));
      return;
    }
    if (phase === "checking") {
      animateIntroOrChecking("center");
    }
  }, [phase, introIndex, checkingIndex, animateIntroOrChecking]);

  useEffect(() => {
    if (hasError && !dataReady) {
      finish();
    }
  }, [hasError, dataReady, finish]);

  useEffect(() => {
    if (dataReady && phase !== "rasoi") {
      goToRasoi();
    }
  }, [dataReady, phase, goToRasoi]);

  useEffect(() => {
    if (phase !== "intro") return;

    const timer = setTimeout(() => {
      if (dataReadyRef.current) return;
      if (introIndex >= MAX_INTRO_LINES - 1) {
        setPhase("checking");
        return;
      }
      setIntroIndex((prev) => prev + 1);
    }, INTRO_MS);

    return () => clearTimeout(timer);
  }, [phase, introIndex]);

  useEffect(() => {
    if (phase !== "checking") return;

    const timer = setInterval(() => {
      if (dataReadyRef.current) return;
      setCheckingIndex((prev) => prev + 1);
    }, CHECKING_MS);

    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "rasoi" || finishedRef.current) return;

    if (rasoiEnteredAtRef.current === null) {
      rasoiEnteredAtRef.current = Date.now();
      animateRasoiIn();
    }

    const enteredAt = rasoiEnteredAtRef.current;
    const holdTarget = dataReadyRef.current && !__DEV__ ? 180 : RASOI_HOLD_MS;
    const waitMs = Math.max(0, holdTarget - (Date.now() - enteredAt));

    const holdTimer = setTimeout(() => {
      if (dataReadyRef.current || hasError) {
        finish();
      }
    }, waitMs);

    return () => clearTimeout(holdTimer);
  }, [phase, hasError, finish, animateRasoiIn]);

  useEffect(
    () => () => {
      pulseLoopRef.current?.stop();
    },
    [],
  );

  const displayLine =
    phase === "intro"
      ? introLine
      : phase === "checking"
        ? checkingLine
        : RASOI_LINE;
  const introAlign = introSide(introIndex);

  return (
    <View
      style={[
        styles.heroCard,
        styles.box,
        isLateNight && styles.heroCardLateNight,
      ]}
    >
      <LinearGradient
        colors={
          isLateNight
            ? ["#1A1410", "#0A0908", "#050505"]
            : ["#161616", "#0A0A0A", "#000000"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        {phase === "rasoi" ? (
          <View style={styles.rasoiWrap}>
            <Animated.Text
              style={[
                styles.rasoiMain,
                styles.textPadding,
                {
                  opacity: rasoiOpacity,
                  transform: [
                    { scale: Animated.multiply(rasoiScale, rasoiPulse) },
                  ],
                },
              ]}
            >
              {RASOI_LINE}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.rasoiSub,
                styles.textPadding,
                {
                  opacity: rasoiSubOpacity,
                  transform: [{ translateY: rasoiSubTranslateY }],
                },
              ]}
            >
              {RASOI_SUB}
            </Animated.Text>
          </View>
        ) : phase === "intro" ? (
          <Animated.Text
            style={[
              styles.introLine,
              styles.textBlock,
              introAlign === "left"
                ? styles.introSlotTop
                : styles.introSlotBottom,
              introAlign === "left" ? styles.introLeft : styles.introRight,
              {
                opacity: textOpacity,
                transform: [
                  { translateX: textTranslateX },
                  { translateY: textTranslateY },
                ],
              },
            ]}
          >
            {displayLine}
          </Animated.Text>
        ) : (
          <View style={styles.checkingSlot}>
            <Animated.Text
              style={[
                styles.checkingLine,
                styles.textPadding,
                styles.checkingCenter,
                {
                  opacity: textOpacity,
                  transform: [
                    { translateX: textTranslateX },
                    { translateY: textTranslateY },
                  ],
                },
              ]}
            >
              {displayLine}
            </Animated.Text>
            <CheckingDots />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: radius.lg,
    overflow: "hidden",
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    ...shadows.card,
  },
  heroCardLateNight: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderWidth: 1,
    borderColor: "rgba(255,107,53,0.45)",
  },
  box: {
    minHeight: 152,
    backgroundColor: "#000000",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 152,
    flex: 1,
    position: "relative",
  },
  textBlock: {
    width: "80%",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  textPadding: {
    width: "100%",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  introSlotTop: {
    position: "absolute",
    top: spacing.lg,
    left: spacing.lg,
  },
  introSlotBottom: {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.lg,
  },
  introLine: {
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 32,
    letterSpacing: 0.15,
    color: colors.white,
  },
  introLeft: {
    textAlign: "left",
  },
  introRight: {
    textAlign: "right",
  },
  checkingSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    alignSelf: "center",
    gap: spacing.sm,
  },
  checkingLine: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    letterSpacing: 0.1,
    color: "rgba(255,255,255,0.78)",
  },
  checkingCenter: {
    textAlign: "center",
  },
  checkingDots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: spacing.xs,
  },
  checkingDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  rasoiWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    width: "80%",
    alignSelf: "center",
  },
  rasoiMain: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.green,
    textAlign: "center",
    lineHeight: 40,
    letterSpacing: 0.2,
  },
  rasoiSub: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 21,
    color: "rgba(255,255,255,0.68)",
  },
});
