import { AppDialog } from "@/components/AppDialog";
import { DateTimeCard } from "@/components/DateTimeCard";
import { FormInput } from "@/components/FormInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SubjectPicker } from "@/components/SubjectPicker";
import { useTasks } from "@/contexts/TaskContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask, deleteTask, toggleComplete } = useTasks();
  const { colors } = useAppTheme();
  const task = useMemo(() => tasks.find((entry) => entry.id === id), [tasks, id]);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task?.title ?? "");
  const [subject, setSubject] = useState(task?.subject ?? "Math");
  const [description, setDescription] = useState(task?.description ?? "");
  const [dueDate, setDueDate] = useState(new Date(task?.dueDate ?? Date.now()));
  const [reminderTime, setReminderTime] = useState(
    new Date(task?.reminderTime ?? Date.now()),
  );
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

  if (!task) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, padding: 24 }}>Task not found.</Text>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      setDialog({ title: "Missing Fields", message: "Please Fill Out All Fields" });
      return;
    }

    setLoading(true);
    await updateTask(task.id, { title, subject, description, dueDate, reminderTime });
    setLoading(false);
    setEditing(false);
  };

  const handleDelete = () => {
    setDialog({
      title: "Delete Task",
      message: "Are you sure you want to delete this task?",
      actions: [
        { label: "Cancel", variant: "secondary", onPress: closeDialog },
        {
          label: "Delete",
          variant: "danger",
          onPress: async () => {
            closeDialog();
            await deleteTask(task.id);
            router.back();
          },
        },
      ],
    });
  };

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

  const handleToggleComplete = async () => {
    await toggleComplete(task.id);
    router.back();
  };

  if (editing) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <FormInput label="Task Title" value={title} onChangeText={setTitle} />
          <Text style={[styles.label, { color: colors.text }]}>Subject</Text>
          <SubjectPicker value={subject} onChange={setSubject} />
          <FormInput
            label="Description"
            value={description}
            onChangeText={setDescription}
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
              label="Reminder"
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
          <PrimaryButton title="Save Changes" loading={loading} onPress={handleSave} />
          <PrimaryButton title="Cancel" variant="secondary" onPress={() => setEditing(false)} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.detail} showsVerticalScrollIndicator={false}>
        <View style={[styles.badge, { backgroundColor: colors.primaryTint }]}>
          <Text style={[styles.badgeText, { color: colors.primaryDark }]}>{task.subject}</Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {task.description}
        </Text>
        <View style={[styles.metaCard, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Due Date</Text>
          <Text style={[styles.metaValue, { color: colors.text }]}>
            {new Date(task.dueDate).toLocaleString()}
          </Text>
          <Text style={[styles.metaLabel, { color: colors.textSecondary, marginTop: 10 }]}>
            Reminder
          </Text>
          <Text style={[styles.metaValue, { color: colors.text }]}>
            {new Date(task.reminderTime).toLocaleString()}
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.actions, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <PrimaryButton
          title={task.completed ? "Mark as Pending" : "Mark as Completed"}
          onPress={handleToggleComplete}
        />
        <View style={styles.iconActions}>
          <Pressable
            onPress={() => setEditing(true)}
            style={[styles.iconBtn, { borderColor: colors.border }]}
          >
            <Ionicons name="create-outline" size={22} color={colors.text} />
            <Text style={[styles.iconLabel, { color: colors.textSecondary }]}>Edit</Text>
          </Pressable>
          <Pressable
            onPress={handleDelete}
            style={[styles.iconBtn, { borderColor: colors.errorTint, backgroundColor: colors.errorTint }]}
          >
            <Ionicons name="trash-outline" size={22} color={colors.error} />
            <Text style={[styles.iconLabel, { color: colors.error }]}>Delete</Text>
          </Pressable>
        </View>
      </View>
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
  detail: { padding: 24, gap: 16, paddingBottom: 40 },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: { fontWeight: "800", fontSize: 12 },
  title: { fontSize: 28, fontWeight: "800", lineHeight: 34 },
  description: { fontSize: 16, lineHeight: 26 },
  metaCard: { borderWidth: 1, borderRadius: 16, padding: 16, marginTop: 8 },
  metaLabel: { fontSize: 12, fontWeight: "600" },
  metaValue: { fontSize: 15, fontWeight: "700", marginTop: 2 },
  actions: {
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
  },
  iconActions: { flexDirection: "row", gap: 12 },
  iconBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
  },
  iconLabel: { fontSize: 14, fontWeight: "600" },
  form: { padding: 24, gap: 18, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: "600" },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  multiline: { minHeight: 100, textAlignVertical: "top" },
  dateRow: { flexDirection: "row", gap: 12 },
});
