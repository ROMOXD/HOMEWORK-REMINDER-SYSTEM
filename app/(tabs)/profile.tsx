import { AppDialog } from "@/components/AppDialog";
import { ScreenContainer } from "@/components/ScreenContainer";
import { BRAND_GREEN, cardShadow } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { tasks } = useTasks();
  const { colors } = useAppTheme();
  const [dialog, setDialog] = useState<{
    title: string;
    message: string;
    actions?: { label: string; onPress: () => void; variant?: "primary" | "secondary" | "danger" }[];
  } | null>(null);

  const closeDialog = () => setDialog(null);

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
    setDialog({
      title: "Logout",
      message: "Are you sure you want to logout?",
      actions: [
        { label: "Cancel", variant: "secondary", onPress: closeDialog },
        {
          label: "Logout",
          variant: "danger",
          onPress: async () => {
            closeDialog();
            await logout();
            router.replace("/(auth)/login" as Href);
          },
        },
      ],
    });
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
            <Ionicons name="person" size={52} color={BRAND_GREEN} />
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
            style={({ pressed }) => [
              styles.menuRow,
              index < menuItems.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 },
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Ionicons name={item.icon} size={20} color={colors.text} />
            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.logout,
          {
            backgroundColor: colors.errorTint,
            borderColor: colors.error,
            shadowColor: colors.error,
            opacity: pressed ? 0.88 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
      </Pressable>
      <AppDialog
        visible={!!dialog}
        title={dialog?.title ?? ""}
        message={dialog?.message}
        actions={dialog?.actions}
        onClose={closeDialog}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", gap: 12, marginTop: 12, marginBottom: 16 },
  avatarRing: {
    borderWidth: 3,
    borderRadius: 70,
    padding: 4,
    marginBottom: 8,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 28, fontWeight: "800" },
  email: { fontSize: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 12, marginBottom: 14 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 12 },
  statCard: {
    width: "47%",
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    gap: 6,
    alignItems: "center",
  },
  statValue: { fontSize: 28, fontWeight: "800" },
  statLabel: { fontSize: 13, fontWeight: "600" },
  menu: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 12,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 14,
  },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: "600" },
  logout: {
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: { fontSize: 16, fontWeight: "800" },
});
