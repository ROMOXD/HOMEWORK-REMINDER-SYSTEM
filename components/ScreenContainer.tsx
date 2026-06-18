import { AuthBackground } from "@/components/AuthBackground";
import { useAppTheme } from "@/hooks/use-app-theme";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenContainerProps = ViewProps & {
  scroll?: boolean;
  padded?: boolean;
  auth?: boolean;
};

export function ScreenContainer({
  children,
  scroll = true,
  padded = true,
  auth = false,
  style,
  ...rest
}: ScreenContainerProps) {
  const { colors } = useAppTheme();
  const content = (
    <View style={[padded && styles.padded, style]} {...rest}>
      {children}
    </View>
  );

  const body = auth ? <AuthBackground style={styles.flex}>{content}</AuthBackground> : content;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {body}
          </ScrollView>
        ) : (
          body
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  padded: { padding: 24, gap: 18 },
});
