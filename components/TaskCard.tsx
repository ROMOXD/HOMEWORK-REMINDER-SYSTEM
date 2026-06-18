import { cardShadow } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import type { Task } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TaskCardProps = {
  task: Task;
  variant?: "default" | "completed" | "deadline";
};

export function TaskCard({ task, variant = "default" }: TaskCardProps) {
  const { colors } = useAppTheme();
  const dueDate = new Date(task.dueDate);
  const isCompleted = variant === "completed" || task.completed;
  const isUrgent = !isCompleted && dueDate.getTime() - Date.now() < 86400000 * 2;

  return (
    <Pressable
      onPress={() => router.push(`/task/${task.id}` as Href)}
      style={({ pressed }) => [
        styles.card,
        cardShadow,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.94 : isCompleted ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: isUrgent ? colors.primary : colors.border }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: colors.primaryTint }]}>
            <Text style={[styles.badgeText, { color: colors.primaryDark }]}>
              {task.subject}
            </Text>
          </View>
          {isCompleted ? (
            <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
          ) : null}
        </View>
        <Text
          style={[
            styles.title,
            { color: isCompleted ? colors.textMuted : colors.text },
          ]}
        >
          {task.title}
        </Text>
        {task.description && variant !== "deadline" ? (
          <Text
            numberOfLines={2}
            style={[styles.description, { color: colors.textSecondary }]}
          >
            {task.description}
          </Text>
        ) : null}
        <Text style={[styles.due, { color: isUrgent ? colors.primary : colors.textSecondary }]}>
          {isCompleted
            ? `Completed ${task.completedAt ? new Date(task.completedAt).toLocaleDateString() : ""}`
            : `Due ${dueDate.toLocaleDateString()} · ${dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  accent: { width: 4 },
  content: { flex: 1, padding: 16, gap: 6 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 11, fontWeight: "800" },
  title: { fontSize: 17, fontWeight: "800" },
  description: { fontSize: 14, lineHeight: 20 },
  due: { fontSize: 12, fontWeight: "700" },
});
