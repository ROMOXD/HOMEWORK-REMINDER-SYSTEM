import { AppDialog } from "@/components/AppDialog";
import { CodeInput } from "@/components/CodeInput";
import { FormInput } from "@/components/FormInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { TextLink } from "@/components/TextLink";
import { SPACING } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ForgotPasswordScreen() {
  const { requestPasswordReset, resetPassword } = useAuth();
  const { colors } = useAppTheme();
  const [step, setStep] = useState<"email" | "code" | "password">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<{
    title: string;
    message: string;
    actions?: { label: string; onPress: () => void; variant?: "primary" | "secondary" | "danger" }[];
  } | null>(null);

  const closeDialog = () => setDialog(null);

  const handleSendCode = async () => {
    setLoading(true);
    const result = await requestPasswordReset(email);
    setLoading(false);

    if (result && result.length === 4) {
      setDialog({
        title: "Verification Code Sent",
        message: `Your 4-digit code is: ${result}\n\n(In production, this would be emailed to you. For now, check above.)`,
        actions: [
          {
            label: "OK",
            variant: "primary",
            onPress: () => {
              closeDialog();
              setStep("code");
            },
          },
        ],
      });
      return;
    }

    setDialog({ title: "Error", message: result ?? "Unable to send verification code" });
  };

  const handleVerifyCode = () => {
    if (code.length !== 4) {
      setDialog({ title: "Invalid Code", message: "Please enter the 4-digit verification code" });
      return;
    }
    setStep("password");
  };

  const handleReset = async () => {
    if (!newPassword.trim()) {
      setDialog({ title: "Invalid Password", message: "Please enter a new password" });
      return;
    }

    setLoading(true);
    const error = await resetPassword(email, code, newPassword);
    setLoading(false);

    if (error) {
      setDialog({ title: "Reset Failed", message: error });
      return;
    }

    setDialog({
      title: "Success",
      message: "Password updated successfully",
      actions: [
        {
          label: "OK",
          variant: "primary",
          onPress: () => {
            closeDialog();
            router.replace("/(auth)/login");
          },
        },
      ],
    });
  };

  return (
    <ScreenContainer auth>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Forgot Password</Text>
        </View>

        <View style={styles.form}>
          <FormInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={step === "email"}
            placeholder="you@school.edu"
          />

          {step === "email" ? (
            <PrimaryButton
              title="Send Verification Code"
              loading={loading}
              onPress={handleSendCode}
            />
          ) : step === "code" ? (
            <>
              <View style={styles.codeSection}>
                <Text style={[styles.codeLabel, { color: colors.text }]}>
                  Verification Code
                </Text>
                <CodeInput value={code} onChange={setCode} />
              </View>
              <PrimaryButton
                title="Verify Code"
                loading={loading}
                onPress={handleVerifyCode}
              />
              <PrimaryButton
                title="Back"
                variant="secondary"
                onPress={() => {
                  setCode("");
                  setStep("email");
                }}
              />
            </>
          ) : (
            <>
              <FormInput
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                placeholder="Create new password"
                rightIconName={showNewPassword ? "eye" : "eye-off"}
                onRightIconPress={() => setShowNewPassword((prev) => !prev)}
                rightIconAccessibilityLabel="Toggle password visibility"
              />
              <PrimaryButton title="Reset Password" loading={loading} onPress={handleReset} />
              <PrimaryButton
                title="Back"
                variant="secondary"
                onPress={() => {
                  setNewPassword("");
                  setShowNewPassword(false);
                  setStep("code");
                }}
              />
            </>
          )}
        </View>

        <TextLink href="/(auth)/login" style={styles.backLink}>
          Back to Login
        </TextLink>
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
    gap: SPACING.md,
    marginBottom: SPACING.xxxl,
    marginTop: SPACING.lg,
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
  codeSection: { gap: SPACING.md },
  codeLabel: { fontSize: 13, fontWeight: "600", letterSpacing: 0.3 },
  backLink: { textAlign: "center", marginTop: SPACING.lg },
});
