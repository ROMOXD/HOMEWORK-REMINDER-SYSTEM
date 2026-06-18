import { BRAND_GREEN, cardShadow } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type DateTimeCardProps = {
  label: string;
  value: Date;
  icon: "calendar-outline" | "time-outline";
  onPress: () => void;
};

export function DateTimeCard({ label, value, icon, onPress }: DateTimeCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        cardShadow,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${BRAND_GREEN}18` }]}>
        <Ionicons name={icon} size={22} color={BRAND_GREEN} />
      </View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>
        {value.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
      </Text>
      <Text style={[styles.time, { color: colors.textSecondary }]}>
        {value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  label: { fontSize: 12, fontWeight: "600" },
  value: { fontSize: 16, fontWeight: "800" },
  time: { fontSize: 13, fontWeight: "500" },
});
