import { useSubjects } from "@/contexts/SubjectsContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

type SubjectFilterProps = {
  value: string;
  onChange: (subject: string) => void;
};

export function SubjectFilter({ value, onChange }: SubjectFilterProps) {
  const { colors } = useAppTheme();
  const { subjects } = useSubjects();
  const options = ["All", ...subjects];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {options.map((option) => {
        const selected = value === option;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: selected ? colors.primary : colors.inputBg,
                borderColor: selected ? colors.primary : colors.border,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: selected ? "#FFFFFF" : colors.text, fontFamily: selected ? "Roboto-Bold" : "Roboto-Medium" },
              ]}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 10,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
