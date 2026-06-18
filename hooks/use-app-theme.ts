import { Colors } from "@/constants/theme";
import { useSettings } from "@/contexts/SettingsContext";

export function useAppTheme() {
  const { settings } = useSettings();
  const scheme = settings.darkMode ? "dark" : "light";
  return { colors: Colors[scheme], scheme, isDark: scheme === "dark" };
}
