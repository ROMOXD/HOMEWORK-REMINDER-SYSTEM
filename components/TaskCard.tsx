import { cardShadow, SPACING } from "@/constants/theme";
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
          opacity: pressed ? 0.92 : isCompleted ? 0.8 : 1,
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
    marginVertical: SPACING.sm,
  },
  accent: { width: 5 },
  content: { flex: 1, padding: SPACING.lg, gap: SPACING.md },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  badgeText: { fontSize: 11, fontWeight: "600", letterSpacing: 0.3 },
  title: { fontSize: 16, fontWeight: "600", lineHeight: 22 },
  description: { fontSize: 13, lineHeight: 20, fontWeight: "500" },
  due: { fontSize: 12, fontWeight: "500" },
});
