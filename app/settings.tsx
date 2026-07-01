import { AppDialog } from "@/components/AppDialog";
import { ScreenContainer } from "@/components/ScreenContainer";
import { BRAND_GREEN, cardShadow } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth();
  const { colors } = useAppTheme();
  const [dialog, setDialog] = useState<{
    title: string;
    message: string;
    actions?: { label: string; onPress: () => void; variant?: "primary" | "secondary" | "danger" }[];
  } | null>(null);

  const closeDialog = () => setDialog(null);

  const showAccountInfo = () => {
    setDialog({
      title: "Account Settings",
      message: `Username: ${user?.username}\nEmail: ${user?.email}`,
      actions: [
        {
          label: "OK",
          variant: "primary",
          onPress: closeDialog,
        },
      ],
    });
  };

  const toggleRows = [
    {
      title: "Enable Notifications",
      subtitle: "Assignment reminders and alerts",
      value: settings.notificationsEnabled,
      onChange: (value: boolean) => updateSettings({ notificationsEnabled: value }),
    },
    {
      title: "Dark Mode",
      subtitle: "Switch between light and dark theme",
      value: settings.darkMode,
      onChange: (value: boolean) => updateSettings({ darkMode: value }),
    },
  ];

  const menuRows = [
    {
      title: "Account Settings",
      subtitle: user?.email ?? "",
      onPress: showAccountInfo,
    },
  ];

  return (
    <ScreenContainer>
      <View style={[styles.group, cardShadow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {toggleRows.map((row, index) => (
          <View
            key={row.title}
            style={[
              styles.row,
              index < toggleRows.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 },
            ]}
          >
            <View style={styles.textBlock}>
              <Text style={[styles.title, { color: colors.text }]}>{row.title}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {row.subtitle}
              </Text>
            </View>
            <Switch
              value={row.value}
              onValueChange={row.onChange}
              trackColor={{ false: colors.border, true: BRAND_GREEN }}
              thumbColor="#FFFFFF"
            />
          </View>
        ))}
      </View>

      <View style={[styles.group, cardShadow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {menuRows.map((row, index) => (
          <Pressable
            key={row.title}
            onPress={row.onPress}
            style={[
              styles.row,
              index < menuRows.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 },
            ]}
          >
            <View style={styles.textBlock}>
              <Text style={[styles.title, { color: colors.text }]}>{row.title}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {row.subtitle}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>
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
  group: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    gap: 12,
  },
  textBlock: { flex: 1, gap: 2 },
  title: { fontSize: 16, fontWeight: "700" },
  subtitle: { fontSize: 13 },
});
