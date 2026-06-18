import { useAppTheme } from "@/hooks/use-app-theme";
import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, type TextStyle } from "react-native";

type TextLinkProps = {
  href: Href;
  children: string;
  style?: TextStyle;
};

export function TextLink({ href, children, style }: TextLinkProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable onPress={() => router.push(href)}>
      <Text style={[styles.link, { color: colors.primary }, style]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    fontSize: 14,
    fontWeight: "700",
  },
});
