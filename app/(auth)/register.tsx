import { FormInput } from "@/components/FormInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { TextLink } from "@/components/TextLink";
import { useAuth } from "@/contexts/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { router, type Href } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function RegisterScreen() {
  const { register } = useAuth();
  const { colors } = useAppTheme();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    const error = await register(username, email, password, confirmPassword);
    setLoading(false);

    if (error) {
      Alert.alert("Registration Failed", error);
      return;
    }

    Alert.alert("Success", "Account created successfully");
    router.replace("/(tabs)" as Href);
  };

  return (
    <ScreenContainer auth>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Join and never miss a deadline again
        </Text>
      </View>

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
        secureTextEntry
        placeholder="Create a password"
      />
      <FormInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Confirm your password"
      />

      <PrimaryButton title="Create Account" loading={loading} onPress={handleRegister} />

      <View style={styles.footer}>
        <Text style={{ color: colors.textSecondary }}>Already have an account?</Text>
        <TextLink href="/(auth)/login">Login</TextLink>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { gap: 6, marginTop: 16, marginBottom: 4 },
  title: { fontSize: 30, fontWeight: "800" },
  subtitle: { fontSize: 15, lineHeight: 22 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
});
