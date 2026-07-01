import { AppDialog } from "@/components/AppDialog";
import { SPACING } from "@/constants/theme";
import { useSubjects } from "@/contexts/SubjectsContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
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

  const [dialog, setDialog] = useState<{
    title: string;
    message: string;
    actions?: { label: string; onPress: () => void; variant?: "primary" | "secondary" | "danger" }[];
  } | null>(null);

  const closeDialog = () => setDialog(null);

  const handleAddCustom = async () => {
    const error = await addCustomSubject(customName);
    if (error) {
      setDialog({ title: "Could not add subject", message: error });
      return;
    }

    const trimmed = customName.trim();
    onChange(trimmed);
    setCustomName("");
    setShowCustomInput(false);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        {subjects.map((option) => (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: value === option ? colors.primary : colors.inputBg,
                borderColor: value === option ? colors.primary : colors.border,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
          >
            <Text
              style={{
                color: value === option ? "#FFFFFF" : colors.text,
                fontWeight: value === option ? "700" : "600",
                fontSize: 13,
              }}
            >
              {option}
            </Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => setShowCustomInput((current) => !current)}
          style={({ pressed }) => [
            styles.chip,
            styles.addChip,
            {
              backgroundColor: showCustomInput ? colors.primaryTint : colors.inputBg,
              borderColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
        >
          <Ionicons name="add" size={16} color={colors.primary} />
          <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 13 }}>Custom</Text>
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
            style={({ pressed }) => [styles.addBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
        </View>
      ) : null}
      <AppDialog
        visible={!!dialog}
        title={dialog?.title ?? ""}
        message={dialog?.message}
        actions={dialog?.actions}
        onClose={closeDialog}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: SPACING.md },
  scrollContainer: { marginVertical: SPACING.xs },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.md,
  },
  addChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  customRow: {
    flexDirection: "row",
    gap: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.md,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: 15,
    fontWeight: "500",
  },
  addBtn: {
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  addBtnText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
});
