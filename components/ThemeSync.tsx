import { useSettings } from "@/contexts/SettingsContext";
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

  useEffect(() => {
    const scheme = settings.darkMode ? "dark" : "light";

    if (Platform.OS !== "web") {
      applyNativeColorScheme(scheme);
    }

    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.documentElement.style.colorScheme = scheme;
      document.body.style.backgroundColor = settings.darkMode ? "#111827" : "#FFFFFF";
    }
  }, [settings.darkMode]);

  return null;
}
