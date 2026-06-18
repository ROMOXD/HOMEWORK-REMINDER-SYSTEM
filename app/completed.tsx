import { BRAND_GREEN, cardShadow } from "@/constants/theme";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useTasks } from "@/contexts/TaskContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function CompletedTasksScreen() {
  const { tasks } = useTasks();
  const { colors } = useAppTheme();

  const completedTasks = tasks
    .filter((task) => task.completed)
    .sort(
      (a, b) =>
        new Date(b.completedAt ?? b.dueDate).getTime() -
        new Date(a.completedAt ?? a.dueDate).getTime(),
    );

  return (
    <ScreenContainer scroll padded={false}>
      <View style={styles.padded}>
        <Text style={[styles.title, { color: colors.text }]}>Completed Tasks</Text>
        <Text style={{ color: colors.textSecondary }}>
          Your finished assignments archive
        </Text>
      </View>

      <View style={[styles.list, styles.padded]}>
        {completedTasks.length === 0 ? (
          <View style={[styles.empty, cardShadow, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No completed tasks yet
            </Text>
          </View>
        ) : (
          completedTasks.map((task) => (
            <Pressable
              key={task.id}
              onPress={() => router.push(`/task/${task.id}` as Href)}
              style={[styles.card, cardShadow, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Ionicons name="checkmark-circle" size={24} color={BRAND_GREEN} />
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: colors.textMuted }]}>
                  {task.title}
                </Text>
                <Text style={[styles.subject, { color: colors.textSecondary }]}>
                  {task.subject}
                </Text>
                {task.completedAt ? (
                  <Text style={[styles.timestamp, { color: colors.textMuted }]}>
                    Completed {new Date(task.completedAt).toLocaleString()}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          ))
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  padded: { paddingHorizontal: 20, gap: 8 },
  title: { fontSize: 24, fontWeight: "800", marginTop: 8 },
  list: { gap: 12, paddingBottom: 24 },
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    alignItems: "flex-start",
  },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 16, fontWeight: "700", textDecorationLine: "line-through" },
  subject: { fontSize: 13, fontWeight: "600" },
  timestamp: { fontSize: 11, fontWeight: "600", marginTop: 4, alignSelf: "flex-end" },
  empty: {
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
  },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
});
