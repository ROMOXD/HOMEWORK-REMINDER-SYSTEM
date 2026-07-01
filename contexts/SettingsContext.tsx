import { useAuth } from "@/contexts/AuthContext";
import { getItem, setItem, StorageKeys } from "@/lib/storage";
import supabase, { hasSupabase } from "@/lib/supabase";
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
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const persistSettings = useCallback(
    async (next: AppSettings) => {
      if (hasSupabase && supabase && user) {
        try {
          const { error } = await supabase
            .from("settings")
            .upsert(
              {
                user_id: user.id,
                notifications_enabled: next.notificationsEnabled,
                dark_mode: next.darkMode,
                language: next.language,
              },
              { onConflict: "user_id" },
            );

          if (error) {
            console.error("Supabase settings upsert failed:", error);
            throw error;
          }
          return;
        } catch (err: any) {
          console.error(
            "Supabase settings persistence failed, falling back to local storage:",
            err.message ?? err,
          );
        }
      }

      await setItem(StorageKeys.settings, next);
    },
    [user?.id],
  );

  useEffect(() => {
    if (hasSupabase && supabase && user) {
      (async () => {
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Supabase settings fetch failed:", error);
          setSettings(defaultSettings);
          setIsLoading(false);
          return;
        }

        if (data) {
          setSettings({
            notificationsEnabled: data.notifications_enabled,
            darkMode: data.dark_mode,
            language: data.language,
          });
          setIsLoading(false);
          return;
        }

        const { error: insertError } = await supabase.from("settings").upsert(
          {
            user_id: user.id,
            notifications_enabled: defaultSettings.notificationsEnabled,
            dark_mode: defaultSettings.darkMode,
            language: defaultSettings.language,
          },
          { onConflict: "user_id" },
        );

        if (insertError) {
          console.error("Supabase settings insert failed:", insertError);
        }

        setSettings(defaultSettings);
        setIsLoading(false);
      })();

      return;
    }

    getItem<AppSettings>(StorageKeys.settings, defaultSettings).then((stored) => {
      setSettings(stored);
      setIsLoading(false);
    });
  }, [user?.id]);

  const updateSettings = useCallback(
    async (patch: Partial<AppSettings>) => {
      setSettings((current) => {
        const next = { ...current, ...patch };
        void persistSettings(next);
        return next;
      });
    },
    [persistSettings],
  );

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
