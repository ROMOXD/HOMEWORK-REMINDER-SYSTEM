import { ScreenContainer } from "@/components/ScreenContainer";
import { BRAND_GREEN, cardShadow } from "@/constants/theme";
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
      <View style={styles.page}>
        {sorted.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: "transparent" }]}> 
            <Ionicons name="notifications-off-outline" size={44} color={colors.textMuted} />
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
              style={({ pressed }) => [
                styles.card,
                cardShadow,
                {
                  backgroundColor: colors.card,
                  opacity: pressed ? 0.9 : item.read ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              {!item.read ? (
                <View style={[styles.unreadDot, { backgroundColor: BRAND_GREEN }]} />
              ) : (
                <View style={styles.dotSpacer} />
              )}
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: colors.text, fontFamily: "Roboto-Bold" }]}>
                  {item.title}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[styles.snippet, { color: colors.textSecondary, fontFamily: "Roboto-Regular" }]}
                >
                  {item.message}
                </Text>
                <Text style={[styles.time, { color: colors.textMuted, fontFamily: "Roboto-Regular" }]}>
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
  page: { gap: 12, marginHorizontal: -4, paddingBottom: 20 },
  card: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 18,
    gap: 14,
    alignItems: "flex-start",
  },
  unreadDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    marginTop: 6,
  },
  dotSpacer: { width: 11 },
  cardBody: { flex: 1, gap: 6 },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  snippet: { fontSize: 14, lineHeight: 21 },
  time: { fontSize: 13, fontWeight: "500", marginTop: 3 },
  empty: {
    borderRadius: 20,
    padding: 36,
    gap: 12,
    alignItems: "center",
    marginTop: 48,
  },
  emptyTitle: { fontSize: 19, fontWeight: "700" },
});
