import { BRAND_GREEN, cardShadow } from "@/constants/theme";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { tasks } = useTasks();
  const { colors } = useAppTheme();

  const completed = tasks.filter((task) => task.completed);
  const onTime = completed.filter(
    (task) =>
      task.completedAt &&
      new Date(task.completedAt).getTime() <= new Date(task.dueDate).getTime(),
  );
  const onTimeRate = completed.length
    ? Math.round((onTime.length / completed.length) * 100)
    : 0;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login" as Href);
        },
      },
    ]);
  };

  const menuItems: { label: string; icon: "settings-outline" | "checkmark-done-outline"; route: Href }[] = [
    { label: "Settings", icon: "settings-outline", route: "/settings" },
    { label: "Completed Tasks", icon: "checkmark-done-outline", route: "/completed" },
  ];

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={[styles.avatarRing, { borderColor: BRAND_GREEN }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primaryTint }]}>
            <Ionicons name="person" size={48} color={BRAND_GREEN} />
          </View>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{user?.username}</Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email}</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Academic Statistics</Text>
      <View style={styles.statsGrid}>
        {[
          { label: "Tasks Completed", value: String(completed.length) },
          { label: "On-Time Rate", value: `${onTimeRate}%` },
          { label: "Total Tasks", value: String(tasks.length) },
          { label: "Pending", value: String(tasks.length - completed.length) },
        ].map((stat) => (
          <View
            key={stat.label}
            style={[styles.statCard, cardShadow, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.statValue, { color: BRAND_GREEN }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.menu, cardShadow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {menuItems.map((item, index) => (
          <Pressable
            key={item.label}
            onPress={() => router.push(item.route)}
            style={[
              styles.menuRow,
              index < menuItems.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 },
            ]}
          >
            <Ionicons name={item.icon} size={20} color={colors.text} />
            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>

      <Pressable onPress={handleLogout} style={styles.logout}>
        <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", gap: 8, marginTop: 8, marginBottom: 8 },
  avatarRing: {
    borderWidth: 3,
    borderRadius: 60,
    padding: 3,
    marginBottom: 4,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 26, fontWeight: "800" },
  email: { fontSize: 14 },
  sectionTitle: { fontSize: 17, fontWeight: "800", marginTop: 8 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: {
    width: "47%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  statValue: { fontSize: 26, fontWeight: "800" },
  statLabel: { fontSize: 12, fontWeight: "600" },
  menu: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 4,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: "600" },
  logout: { alignItems: "center", paddingVertical: 20 },
  logoutText: { fontSize: 16, fontWeight: "800" },
});
