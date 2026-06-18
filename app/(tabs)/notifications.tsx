import { BRAND_GREEN, cardShadow } from "@/constants/theme";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useTasks } from "@/contexts/TaskContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { timeAgo } from "@/lib/format-time";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function NotificationsScreen() {
  const { notifications, markNotificationRead } = useTasks();
  const { colors } = useAppTheme();

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <ScreenContainer>
      <View style={[styles.page, { backgroundColor: colors.backgroundMuted }]}>
        {sorted.length === 0 ? (
          <View style={[styles.empty, cardShadow, { backgroundColor: colors.card }]}>
            <Ionicons name="notifications-off-outline" size={40} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No notifications yet
            </Text>
            <Text style={{ color: colors.textSecondary, textAlign: "center" }}>
              Reminders and assignment alerts will appear here.
            </Text>
          </View>
        ) : (
          sorted.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => markNotificationRead(item.id)}
              style={[
                styles.card,
                cardShadow,
                {
                  backgroundColor: colors.card,
                  opacity: item.read ? 0.82 : 1,
                },
              ]}
            >
              {!item.read ? (
                <View style={[styles.unreadDot, { backgroundColor: BRAND_GREEN }]} />
              ) : (
                <View style={styles.dotSpacer} />
              )}
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[styles.snippet, { color: colors.textSecondary }]}
                >
                  {item.message}
                </Text>
                <Text style={[styles.time, { color: colors.textMuted }]}>
                  {timeAgo(item.createdAt)}
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  page: { gap: 10, marginHorizontal: -4, paddingBottom: 20 },
  card: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    alignItems: "flex-start",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  dotSpacer: { width: 10 },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 16, fontWeight: "800" },
  snippet: { fontSize: 14, lineHeight: 20 },
  time: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  empty: {
    borderRadius: 16,
    padding: 32,
    gap: 10,
    alignItems: "center",
    marginTop: 40,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
});
