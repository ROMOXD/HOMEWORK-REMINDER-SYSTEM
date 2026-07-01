import { Colors } from "@/constants/theme";
import { useSettings } from "@/contexts/SettingsContext";
import { usePathname, useSegments } from "expo-router";

export function shouldForceLightMode(pathname?: string | null, segments?: string[] | null) {
  const normalizedSegments = segments ?? [];
  const normalizedPathname = pathname ?? "";

  if (normalizedSegments.some((segment) => segment === "(auth)" || segment === "auth")) {
    return true;
  }

  if (normalizedSegments.some((segment) => ["login", "register", "forgot-password"].includes(segment))) {
    return true;
  }

  return normalizedPathname.includes("/(auth)") || normalizedPathname.includes("(auth)") || normalizedPathname.includes("/login") || normalizedPathname.includes("/register") || normalizedPathname.includes("/forgot-password");
}

export function useAppTheme() {
  const { settings } = useSettings();
  const pathname = usePathname();
  const segments = useSegments();
  const forceLight = shouldForceLightMode(pathname, segments);
  const scheme = forceLight ? "light" : settings.darkMode ? "dark" : "light";

  return { colors: Colors[scheme], scheme, isDark: scheme === "dark" };
}
