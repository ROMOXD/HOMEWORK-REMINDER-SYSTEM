import { BRAND_GREEN, inputShadow } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useRef } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";

type CodeInputProps = {
  value: string;
  onChange: (code: string) => void;
  length?: number;
};

export function CodeInput({ value, onChange, length = 4 }: CodeInputProps) {
  const { colors } = useAppTheme();
  const refs = useRef<(TextInput | null)[]>([]);
  const digits = value.padEnd(length, " ").split("").slice(0, length);

  const updateDigit = (index: number, digit: string) => {
    const clean = digit.replace(/\D/g, "").slice(-1);
    const next = digits.map((d, i) => (i === index ? clean || " " : d));
    const code = next.join("").trimEnd();
    onChange(code.replace(/\s/g, ""));

    if (clean && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    index: number,
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (event.nativeEvent.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            refs.current[index] = ref;
          }}
          value={digits[index]?.trim() ?? ""}
          onChangeText={(text) => updateDigit(index, text)}
          onKeyPress={(event) => handleKeyPress(index, event)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          style={[
            styles.box,
            inputShadow,
            {
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: digits[index]?.trim() ? BRAND_GREEN : colors.border,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 72,
    borderWidth: 2,
    borderRadius: 14,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
});
