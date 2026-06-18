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
        : colors.card;

  const textColor =
    variant === "secondary" ? colors.primary : "#FFFFFF";

  const isPill = variant === "pill";

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isPill && styles.pill,
        {
          backgroundColor,
          borderColor: variant === "secondary" ? colors.primary : backgroundColor,
          opacity: isDisabled ? 0.6 : pressed ? 0.88 : 1,
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
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  pillText: {
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
