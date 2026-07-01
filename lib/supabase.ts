import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import "expo-sqlite/localStorage/install";
import "react-native-url-polyfill/auto";

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;
const SUPABASE_URL =
  extra.EXPO_PUBLIC_SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY =
  extra.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  extra.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  "";

export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

export { SUPABASE_KEY, SUPABASE_URL };

export const supabase: any = hasSupabase
  ? createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        storage: localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export default supabase;
