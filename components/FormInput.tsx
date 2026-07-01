import { SPACING } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    type TextInputProps,
} from "react-native";

type FormInputProps = TextInputProps & {
  label: string;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  rightIconAccessibilityLabel?: string;
  rightIconColor?: string;
};

export function FormInput({
  label,
  style,
  rightIconName,
  onRightIconPress,
  rightIconAccessibilityLabel,
  rightIconColor,
  ...rest
}: FormInputProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.border,
              color: colors.text,
            },
            style,
          ]}
          {...rest}
        />
        {rightIconName ? (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel={rightIconAccessibilityLabel}
          >
            <Ionicons name={rightIconName} size={20} color={rightIconColor ?? colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: SPACING.sm },
  label: { fontSize: 13, fontWeight: "600", letterSpacing: 0.3 },
  inputWrapper: { position: "relative" },
  iconButton: {
    position: "absolute",
    right: SPACING.lg,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    padding: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingRight: 48,
    fontSize: 16,
    fontWeight: "500",
  },
});
