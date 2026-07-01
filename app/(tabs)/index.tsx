import { ScreenContainer } from "@/components/ScreenContainer";
import { SubjectFilter } from "@/components/SubjectFilter";
import { TaskCard } from "@/components/TaskCard";
import { BRAND_GREEN, SPACING } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const { colors } = useAppTheme();
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [showCompleted, setShowCompleted] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => task.completed === showCompleted)
      .filter((task) => (subject === "All" ? true : task.subject === subject))
      .filter((task) => {
        const query = search.trim().toLowerCase();
        if (!query) return true;
        return (
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.subject.toLowerCase().includes(query)
        );
      })
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      );
  }, [tasks, search, subject, showCompleted]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenContainer scroll padded={false}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Hello, {user?.username ?? "User"}
            </Text>
            <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
              Stay on top of your assignments
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/(tabs)/profile")}
            style={[styles.avatarRing, { borderColor: BRAND_GREEN }]}
          >
            <View style={[styles.avatar, { backgroundColor: colors.primaryTint }]}>
              <Ionicons name="person" size={24} color={BRAND_GREEN} />
            </View>
          </Pressable>
        </View>

        <View style={styles.padded}>
          <View style={[styles.searchWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search tasks..."
              placeholderTextColor={colors.textMuted}
              style={[styles.search, { color: colors.text }]}
            />
          </View>

          <SubjectFilter value={subject} onChange={setSubject} />

          <View style={[styles.tabRow, { backgroundColor: colors.inputBg }]}>
            <Pressable
              onPress={() => setShowCompleted(false)}
              style={[
                styles.tab,
                !showCompleted && { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: !showCompleted ? "#FFFFFF" : colors.textSecondary },
                ]}
              >
                Pending Tasks
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setShowCompleted(true)}
              style={[
                styles.tab,
                showCompleted && { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: showCompleted ? "#FFFFFF" : colors.textSecondary },
                ]}
              >
                Completed Tasks
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.list, styles.padded]}>
          {filteredTasks.length === 0 ? (
            <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No tasks found
              </Text>
              <Text style={{ color: colors.textSecondary, textAlign: "center" }}>
                {showCompleted
                  ? "Completed tasks will appear here."
                  : "Tap + to add your first homework reminder."}
              </Text>
            </View>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                variant={showCompleted ? "completed" : "default"}
              />
            ))
          )}
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerText: { flex: 1, gap: SPACING.sm },
  greeting: { fontSize: 28, fontWeight: "700" },
  subGreeting: { fontSize: 14, fontWeight: "500" },
  avatarRing: {
    borderWidth: 2,
    borderRadius: 32,
    padding: 3,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  padded: { paddingHorizontal: SPACING.xl, gap: SPACING.lg },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  search: { flex: 1, fontSize: 16, fontWeight: "500" },
  tabRow: {
    flexDirection: "row",
    borderRadius: 12,
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  tab: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  tabText: { fontSize: 14, fontWeight: "600" },
  list: { gap: SPACING.lg, paddingBottom: 120 },
  empty: {
    borderWidth: 1,
    borderRadius: 16,
    padding: SPACING.xxxl,
    gap: SPACING.lg,
    alignItems: "center",
  },
  emptyTitle: { fontSize: 18, fontWeight: "600" },
});
