import { useSubjects } from "@/contexts/SubjectsContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type SubjectPickerProps = {
  value: string;
  onChange: (subject: string) => void;
};

export function SubjectPicker({ value, onChange }: SubjectPickerProps) {
  const { colors } = useAppTheme();
  const { subjects, addCustomSubject } = useSubjects();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState("");

  const handleAddCustom = async () => {
    const error = await addCustomSubject(customName);
    if (error) {
      Alert.alert("Could not add subject", error);
      return;
    }

    const trimmed = customName.trim();
    onChange(trimmed);
    setCustomName("");
    setShowCustomInput(false);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {subjects.map((option) => (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[
              styles.chip,
              {
                backgroundColor: value === option ? colors.primary : colors.inputBg,
                borderColor: value === option ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={{
                color: value === option ? "#FFFFFF" : colors.text,
                fontWeight: "600",
              }}
            >
              {option}
            </Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => setShowCustomInput((current) => !current)}
          style={[
            styles.chip,
            styles.addChip,
            {
              backgroundColor: showCustomInput ? colors.primaryTint : colors.inputBg,
              borderColor: colors.primary,
            },
          ]}
        >
          <Ionicons name="add" size={16} color={colors.primary} />
          <Text style={{ color: colors.primary, fontWeight: "700" }}>Custom</Text>
        </Pressable>
      </ScrollView>

      {showCustomInput ? (
        <View style={styles.customRow}>
          <TextInput
            value={customName}
            onChangeText={setCustomName}
            placeholder="Enter custom subject"
            placeholderTextColor={colors.textMuted}
            style={[
              styles.customInput,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
          />
          <Pressable
            onPress={handleAddCustom}
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 10 },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  addChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  customRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  addBtn: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
});
