import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { SubjectsProvider } from "@/contexts/SubjectsContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { ThemeSync } from "@/components/ThemeSync";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "expo-notifications functionality is not fully supported in Expo Go",
  "Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go",
  "Supabase notification persistence failed",
  "Supabase notification upsert failed",
]);

function RootNavigator() {
  const { isDark, colors } = useAppTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-task" options={{ headerShown: false }} />
        <Stack.Screen name="task/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="completed" options={{ title: "Completed Tasks", headerShadowVisible: false }} />
        <Stack.Screen name="settings" options={{ title: "Settings", headerShadowVisible: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <TaskProvider>
          <SubjectsProvider>
            <ThemeSync />
            <RootNavigator />
          </SubjectsProvider>
        </TaskProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
