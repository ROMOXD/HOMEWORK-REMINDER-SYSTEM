import { getItem, setItem, StorageKeys } from "@/lib/storage";
import type { AppSettings } from "@/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const defaultSettings: AppSettings = {
  notificationsEnabled: true,
  darkMode: false,
  language: "en",
};

type SettingsContextValue = {
  settings: AppSettings;
  isLoading: boolean;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getItem<AppSettings>(StorageKeys.settings, defaultSettings).then((stored) => {
      setSettings(stored);
      setIsLoading(false);
    });
  }, []);

  const updateSettings = useCallback(async (patch: Partial<AppSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      void setItem(StorageKeys.settings, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ settings, isLoading, updateSettings }),
    [settings, isLoading, updateSettings],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
