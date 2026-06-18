import { BRAND_GREEN } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { StyleSheet, View, type ViewProps } from "react-native";

export function AuthBackground({ children, style, ...rest }: ViewProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }, style]} {...rest}>
      <View style={styles.accentWrap} pointerEvents="none">
        <View style={[styles.circleLarge, { backgroundColor: BRAND_GREEN }]} />
        <View style={[styles.circleSmall, { backgroundColor: BRAND_GREEN }]} />
        <View style={[styles.triangle, { borderBottomColor: `${BRAND_GREEN}33` }]} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  accentWrap: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 220,
    height: 220,
    overflow: "hidden",
  },
  circleLarge: {
    position: "absolute",
    top: -60,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.12,
  },
  circleSmall: {
    position: "absolute",
    top: 30,
    right: 60,
    width: 70,
    height: 70,
    borderRadius: 35,
    opacity: 0.18,
  },
  triangle: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 100,
    borderBottomWidth: 100,
    borderLeftColor: "transparent",
    opacity: 0.5,
  },
});
