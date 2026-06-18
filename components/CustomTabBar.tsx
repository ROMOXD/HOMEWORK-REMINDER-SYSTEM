import { BRAND_GREEN, cardShadow } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabConfig = {
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
};

const LEFT_TABS: TabConfig[] = [
  { route: "index", icon: "home-outline", iconFocused: "home" },
  { route: "calendar", icon: "calendar-outline", iconFocused: "calendar" },
];

const RIGHT_TABS: TabConfig[] = [
  { route: "notifications", icon: "notifications-outline", iconFocused: "notifications" },
  { route: "profile", icon: "person-outline", iconFocused: "person" },
];

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  const barColor = isDark ? "#1F2937" : "#1B4332";

  const renderTab = (config: TabConfig) => {
    const routeIndex = state.routes.findIndex((route) => route.name === config.route);
    const isFocused = state.index === routeIndex;

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: state.routes[routeIndex].key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(config.route);
      }
    };

    return (
      <Pressable
        key={config.route}
        onPress={onPress}
        style={styles.tabButton}
        hitSlop={8}
      >
        <Ionicons
          name={isFocused ? config.iconFocused : config.icon}
          size={24}
          color={isFocused ? BRAND_GREEN : "#FFFFFF"}
        />
      </Pressable>
    );
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={[styles.bar, cardShadow, { backgroundColor: barColor }]}>
        <View style={styles.sideGroup}>{LEFT_TABS.map(renderTab)}</View>
        <View style={styles.centerSlot} />
        <View style={styles.sideGroup}>{RIGHT_TABS.map(renderTab)}</View>

        <Pressable
          onPress={() => router.push("/add-task")}
          style={({ pressed }) => [
            styles.centerButton,
            cardShadow,
            {
              backgroundColor: BRAND_GREEN,
              borderColor: colors.background,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Ionicons name="add" size={34} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    height: 64,
    paddingHorizontal: 12,
    position: "relative",
  },
  sideGroup: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  centerSlot: {
    width: 72,
  },
  tabButton: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  centerButton: {
    position: "absolute",
    alignSelf: "center",
    top: -26,
    left: "50%",
    marginLeft: -32,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
  },
});
