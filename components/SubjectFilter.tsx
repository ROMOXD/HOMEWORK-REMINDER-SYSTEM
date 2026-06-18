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
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {options.map((option) => {
        const selected = value === option;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? colors.primary : colors.inputBg,
                borderColor: selected ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: selected ? "#FFFFFF" : colors.text },
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
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginRight: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
