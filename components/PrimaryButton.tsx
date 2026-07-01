import { SPACING, buttonShadow } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    ViewStyle,
    type PressableProps,
} from "react-native";

type PrimaryButtonProps = Omit<PressableProps, "style"> & {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "pill";
  style?: ViewStyle;
};

export function PrimaryButton({
  title,
  loading,
  variant = "primary",
  disabled,
  style,
  ...rest
}: PrimaryButtonProps) {
  const { colors } = useAppTheme();
  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === "primary" || variant === "pill"
      ? colors.primary
      : variant === "danger"
        ? colors.error
        : "transparent";

  const textColor =
    variant === "secondary" ? colors.primary : "#FFFFFF";

  const isPill = variant === "pill";

  const shouldUseShadow = variant === "primary" || variant === "danger";
  const shadowColor = variant === "danger" ? colors.error : colors.primary;
  const variantShadow = shouldUseShadow
    ? { ...buttonShadow, shadowColor }
    : undefined;

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isPill && styles.pill,
        !isPill && variantShadow,
        {
          backgroundColor,
          borderColor: variant === "secondary" ? colors.primary : backgroundColor,
          borderWidth: variant === "secondary" ? 1 : 0,
          opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, isPill && styles.pillText, { color: textColor }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    borderWidth: 0,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    borderRadius: 999,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
