import { FormInput } from "@/components/FormInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { TextLink } from "@/components/TextLink";
import { useAuth } from "@/contexts/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { router, type Href } from "expo-router";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  const { login } = useAuth();
  const { colors } = useAppTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const error = await login(email, password);
    setLoading(false);

    if (error) {
      Alert.alert("Login Failed", error);
      return;
    }

    Alert.alert("Success", "Login Successful");
    router.replace("/(tabs)" as Href);
  };

  return (
    <ScreenContainer auth>
      <View style={styles.hero}>
        <Image source={require("@/assets/images/icon.png")} style={styles.logo} />
      </View>

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
        secureTextEntry
        placeholder="Enter your password"
      />

      <TextLink href="/(auth)/forgot-password" style={styles.forgotLink}>
        Forgot Password?
      </TextLink>

      <PrimaryButton title="LOGIN" loading={loading} onPress={handleLogin} />

      <View style={styles.footer}>
        <Text style={{ color: colors.textSecondary }}>Do not have an account?</Text>
        <TextLink href="/(auth)/register">Register</TextLink>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", marginTop: 24, marginBottom: 16 },
  logo: { width: 96, height: 96, borderRadius: 24 },
  forgotLink: { alignSelf: "flex-end", marginTop: -4 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
});
