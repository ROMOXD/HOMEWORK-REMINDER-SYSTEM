import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export const StorageKeys = {
  users: "hrs_users",
  session: "hrs_session",
  tasks: "hrs_tasks",
  notifications: "hrs_notifications",
  settings: "hrs_settings",
  resetCode: "hrs_reset_code",
  customSubjects: "hrs_custom_subjects",
} as const;
