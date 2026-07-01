import { useSettings } from "@/contexts/SettingsContext";
import { shouldForceLightMode } from "@/hooks/use-app-theme";
import { usePathname, useSegments } from "expo-router";
import { useEffect } from "react";
import { Appearance, Platform } from "react-native";

function applyNativeColorScheme(scheme: "light" | "dark") {
  if (typeof Appearance.setColorScheme === "function") {
    Appearance.setColorScheme(scheme);
  }
}

/** Keeps the OS / RN color scheme in sync with the in-app dark mode toggle. */
export function ThemeSync() {
  const { settings } = useSettings();
  const pathname = usePathname();
  const segments = useSegments();
  const forceLight = shouldForceLightMode(pathname, segments);

  useEffect(() => {
    const scheme = forceLight ? "light" : settings.darkMode ? "dark" : "light";

    if (Platform.OS !== "web") {
      applyNativeColorScheme(scheme);
    }

    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.documentElement.style.colorScheme = scheme;
      document.body.style.backgroundColor = scheme === "dark" ? "#111827" : "#FFFFFF";
    }
  }, [forceLight, settings.darkMode]);

  return null;
}
