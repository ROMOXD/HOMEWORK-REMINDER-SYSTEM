import { CodeInput } from "@/components/CodeInput";
import { FormInput } from "@/components/FormInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { TextLink } from "@/components/TextLink";
import { useAuth } from "@/contexts/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function ForgotPasswordScreen() {
  const { requestPasswordReset, resetPassword } = useAuth();
  const { colors } = useAppTheme();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    setLoading(true);
    const result = await requestPasswordReset(email);
    setLoading(false);

    if (result && result.length === 4) {
      Alert.alert(
        "Verification Code Sent",
        `Your 4-digit code is: ${result}\n\n(In production, this would be emailed to you.)`,
      );
      setStep("reset");
      return;
    }

    Alert.alert("Error", result ?? "Unable to send verification code");
  };

  const handleReset = async () => {
    if (code.length !== 4) {
      Alert.alert("Invalid Code", "Please enter the 4-digit verification code");
      return;
    }

    setLoading(true);
    const error = await resetPassword(email, code, newPassword);
    setLoading(false);

    if (error) {
      Alert.alert("Reset Failed", error);
      return;
    }

    Alert.alert("Success", "Password updated successfully");
    router.replace("/(auth)/login");
  };

  return (
    <ScreenContainer auth>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Forgot Password</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {step === "email"
            ? "No worries! Enter your email and we will send you a quick verification code."
            : "Enter the 4-digit code we sent, then choose a new password."}
        </Text>
      </View>

      <FormInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={step === "email"}
        placeholder="you@school.edu"
      />

      {step === "reset" ? (
        <>
          <View style={styles.codeSection}>
            <Text style={[styles.codeLabel, { color: colors.text }]}>
              Verification Code
            </Text>
            <CodeInput value={code} onChange={setCode} />
          </View>
          <FormInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="Create new password"
          />
          <PrimaryButton title="Reset Password" loading={loading} onPress={handleReset} />
        </>
      ) : (
        <PrimaryButton
          title="Send Verification Code"
          loading={loading}
          onPress={handleSendCode}
        />
      )}

      <TextLink href="/(auth)/login" style={styles.backLink}>
        Back to Login
      </TextLink>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { gap: 8, marginTop: 16, marginBottom: 4 },
  title: { fontSize: 30, fontWeight: "800" },
  subtitle: { fontSize: 15, lineHeight: 24 },
  codeSection: { gap: 12 },
  codeLabel: { fontSize: 14, fontWeight: "600" },
  backLink: { textAlign: "center", marginTop: 4 },
});
