import { AppDialog } from "@/components/AppDialog";
import { FormInput } from "@/components/FormInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { TextLink } from "@/components/TextLink";
import { SPACING } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { router, type Href } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function RegisterScreen() {
  const { register } = useAuth();
  const { colors } = useAppTheme();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<{
    title: string;
    message: string;
    actions?: { label: string; onPress: () => void; variant?: "primary" | "secondary" | "danger" }[];
  } | null>(null);

  const closeDialog = () => setDialog(null);

  const handleRegister = async () => {
    setLoading(true);
    const error = await register(username, email, password, confirmPassword);
    setLoading(false);

    if (error) {
      setDialog({ title: "Registration Failed", message: error });
      return;
    }

    setDialog({
      title: "Success",
      message: "Account created successfully",
      actions: [
        {
          label: "OK",
          variant: "primary",
          onPress: () => {
            closeDialog();
            router.replace("/(tabs)" as Href);
          },
        },
      ],
    });
  };

  return (
    <ScreenContainer auth>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Image source={require("@/assets/images/studii-logo.png")} style={styles.logo} />
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
        </View>

        <View style={styles.form}>
          <FormInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
          />
          <FormInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@school.edu"
          />
          <FormInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="Create a password"
            rightIconName={showPassword ? "eye" : "eye-off"}
            onRightIconPress={() => setShowPassword((prev) => !prev)}
            rightIconAccessibilityLabel="Toggle password visibility"
          />
          <FormInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            placeholder="Confirm your password"
            rightIconName={showConfirmPassword ? "eye" : "eye-off"}
            onRightIconPress={() => setShowConfirmPassword((prev) => !prev)}
            rightIconAccessibilityLabel="Toggle password visibility"
          />

          <PrimaryButton title="Create Account" loading={loading} onPress={handleRegister} />
        </View>

        <View style={styles.footer}>
          <Text style={{ color: colors.textSecondary }}>Already have an account?</Text>
          <TextLink href="/(auth)/login">Login</TextLink>
        </View>
      </ScrollView>
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
  content: {
    paddingVertical: SPACING.xl,
  },
  header: {
    alignItems: "center",
    gap: SPACING.md,
    marginBottom: SPACING.xxxl,
    marginTop: SPACING.lg,
  },
  logo: {
    width: 170,
    height: 150,
    resizeMode: "contain",
  },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    color: "#64748B",
  },
  form: {
    gap: SPACING.lg,
    marginBottom: SPACING.xxxl,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
});
