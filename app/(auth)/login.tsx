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
import { Image, StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  const { login } = useAuth();
  const { colors } = useAppTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<{
    title: string;
    message: string;
    actions?: { label: string; onPress: () => void; variant?: "primary" | "secondary" | "danger" }[];
  } | null>(null);

  const closeDialog = () => setDialog(null);

  const handleLogin = async () => {
    setLoading(true);
    const error = await login(email, password);
    setLoading(false);

    if (error) {
      setDialog({ title: "Login Failed", message: error });
      return;
    }

    setDialog({
      title: "Success",
      message: "Login Successful",
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
      <View style={styles.header}>
        <Image source={require("@/assets/images/studii-logo.png")} style={styles.logo} />
      </View>

      <View style={styles.form}>
        <FormInput
          label="Email Address"
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
          placeholder="Enter your password"
          rightIconName={showPassword ? "eye" : "eye-off"}
          onRightIconPress={() => setShowPassword((prev) => !prev)}
          rightIconAccessibilityLabel="Toggle password visibility"
        />

        <TextLink href="/(auth)/forgot-password" style={styles.forgotLink}>
          Forgot Password?
        </TextLink>

        <PrimaryButton title="LOGIN" loading={loading} onPress={handleLogin} />
      </View>

      <View style={styles.footer}>
        <Text style={{ color: colors.textSecondary }}>Do not have an account?</Text>
        <TextLink href="/(auth)/register">Register</TextLink>
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
  header: {
    alignItems: "center",
    marginBottom: SPACING.xxxl,
    marginTop: SPACING.lg,
  },
  logo: {
    width: 170,
    height: 150,
    marginBottom: SPACING.xl,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
  },
  form: {
    gap: SPACING.lg,
    marginBottom: SPACING.xxxl,
  },
  forgotLink: {
    alignSelf: "flex-end",
    marginTop: -SPACING.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.sm,
  },
});
