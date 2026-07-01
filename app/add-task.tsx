import { AppDialog } from "@/components/AppDialog";
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
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showDueTimePicker, setShowDueTimePicker] = useState(false);
  const [showReminderDatePicker, setShowReminderDatePicker] = useState(false);
  const [showReminderTimePicker, setShowReminderTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<{
    title: string;
    message: string;
    actions?: { label: string; onPress: () => void; variant?: "primary" | "secondary" | "danger" }[];
  } | null>(null);

  const closeDialog = () => setDialog(null);

  const isDismissed = (event: any) =>
    event?.type === "dismissed" || event?.nativeEvent?.action === "dismissed";

  const handleDueDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDueDatePicker(false);
      if (isDismissed(_event) || !selectedDate) {
        setShowDueTimePicker(false);
        return;
      }
      const nextDate = new Date(dueDate);
      nextDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );
      setDueDate(nextDate);
      setShowDueTimePicker(true);
      return;
    }

    if (selectedDate) setDueDate(selectedDate);
    setShowDueDatePicker(Platform.OS === "ios");
  };

  const handleDueTimeChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDueTimePicker(false);
      if (isDismissed(_event) || !selectedDate) return;
      const nextDate = new Date(dueDate);
      nextDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      setDueDate(nextDate);
      return;
    }

    if (selectedDate) setDueDate(selectedDate);
    setShowDueDatePicker(Platform.OS === "ios");
  };

  const handleReminderDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowReminderDatePicker(false);
      if (isDismissed(_event) || !selectedDate) {
        setShowReminderTimePicker(false);
        return;
      }
      const nextReminder = new Date(reminderTime);
      nextReminder.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );
      setReminderTime(nextReminder);
      setShowReminderTimePicker(true);
      return;
    }

    if (selectedDate) setReminderTime(selectedDate);
    setShowReminderDatePicker(Platform.OS === "ios");
  };

  const handleReminderTimeChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowReminderTimePicker(false);
      if (isDismissed(_event) || !selectedDate) return;
      const nextReminder = new Date(reminderTime);
      nextReminder.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      setReminderTime(nextReminder);
      return;
    }

    if (selectedDate) setReminderTime(selectedDate);
    setShowReminderDatePicker(Platform.OS === "ios");
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      setDialog({ title: "Missing Fields", message: "Please Fill Out All Fields" });
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
          placeholder="Chapter 5 Worksheet"
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
            onPress={() => setShowDueDatePicker(true)}
          />
          <DateTimeCard
            label="Reminder Time"
            value={reminderTime}
            icon="time-outline"
            onPress={() => setShowReminderDatePicker(true)}
          />
        </View>

        {showDueDatePicker ? (
          <DateTimePicker
            value={dueDate}
            mode={Platform.OS === "android" ? "date" : "datetime"}
            onChange={handleDueDateChange}
          />
        ) : null}
        {showDueTimePicker ? (
          <DateTimePicker
            value={dueDate}
            mode="time"
            onChange={handleDueTimeChange}
          />
        ) : null}

        {showReminderDatePicker ? (
          <DateTimePicker
            value={reminderTime}
            mode={Platform.OS === "android" ? "date" : "datetime"}
            onChange={handleReminderDateChange}
          />
        ) : null}
        {showReminderTimePicker ? (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            onChange={handleReminderTimeChange}
          />
        ) : null}
      </ScrollView>
      <AppDialog
        visible={!!dialog}
        title={dialog?.title ?? ""}
        message={dialog?.message}
        actions={dialog?.actions}
        onClose={closeDialog}
      />
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
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  cancel: { fontSize: 16, fontWeight: "600", fontFamily: "Roboto-Medium", width: 70 },
  navTitle: { fontSize: 18, fontWeight: "800", fontFamily: "Roboto-Bold" },
  saveBtn: { width: 80 },
  form: { padding: 28, gap: 20, paddingBottom: 40 },
  label: { fontSize: 15, fontWeight: "700", fontFamily: "Roboto-Bold" },
  multiline: { minHeight: 120, textAlignVertical: "top" },
  dateRow: { flexDirection: "row", gap: 14 },
});
