import { DateTimeCard } from "@/components/DateTimeCard";
import { FormInput } from "@/components/FormInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SubjectPicker } from "@/components/SubjectPicker";
import { DEFAULT_SUBJECTS } from "@/constants/theme";
import { useTasks } from "@/contexts/TaskContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Stack, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddTaskScreen() {
  const { addTask } = useTasks();
  const { colors } = useAppTheme();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<string>(DEFAULT_SUBJECTS[0]);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000));
  const [reminderTime, setReminderTime] = useState(new Date(Date.now() + 3600000));
  const [showDuePicker, setShowDuePicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Missing Fields", "Please Fill Out All Fields");
      return;
    }

    setLoading(true);
    await addTask({ title, subject, description, dueDate, reminderTime });
    setLoading(false);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.nav, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={[styles.cancel, { color: colors.textSecondary }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]}>Add Task</Text>
        <PrimaryButton
          title="Save"
          variant="pill"
          loading={loading}
          onPress={handleSave}
          style={styles.saveBtn}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormInput
          label="Task Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Chapter 5 Worksheet"
        />

        <Text style={[styles.label, { color: colors.text }]}>Subject</Text>
        <SubjectPicker value={subject} onChange={setSubject} />

        <FormInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Task details"
          multiline
          style={styles.multiline}
        />

        <View style={styles.dateRow}>
          <DateTimeCard
            label="Due Date"
            value={dueDate}
            icon="calendar-outline"
            onPress={() => setShowDuePicker(true)}
          />
          <DateTimeCard
            label="Reminder Time"
            value={reminderTime}
            icon="time-outline"
            onPress={() => setShowReminderPicker(true)}
          />
        </View>

        {showDuePicker ? (
          <DateTimePicker
            value={dueDate}
            mode="datetime"
            onChange={(_, date) => {
              setShowDuePicker(Platform.OS === "ios");
              if (date) setDueDate(date);
            }}
          />
        ) : null}
        {showReminderPicker ? (
          <DateTimePicker
            value={reminderTime}
            mode="datetime"
            onChange={(_, date) => {
              setShowReminderPicker(Platform.OS === "ios");
              if (date) setReminderTime(date);
            }}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  cancel: { fontSize: 16, fontWeight: "600", width: 70 },
  navTitle: { fontSize: 17, fontWeight: "800" },
  saveBtn: { width: 80 },
  form: { padding: 24, gap: 18, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: "600" },
  multiline: { minHeight: 110, textAlignVertical: "top" },
  dateRow: { flexDirection: "row", gap: 12 },
});
