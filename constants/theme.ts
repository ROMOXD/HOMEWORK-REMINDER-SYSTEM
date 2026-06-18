export const BRAND_GREEN = "#3ADB1D";

export const Colors = {
  light: {
    text: "#111827",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
    background: "#FFFFFF",
    backgroundMuted: "#F9FAFB",
    card: "#FFFFFF",
    inputBg: "#F3F4F6",
    border: "#E5E7EB",
    primary: BRAND_GREEN,
    primaryDark: "#2DB817",
    primaryTint: "#E8FCE3",
    success: BRAND_GREEN,
    error: "#EF4444",
    errorTint: "#FEE2E2",
    warning: BRAND_GREEN,
    tint: BRAND_GREEN,
    tabIconDefault: "#9CA3AF",
    tabIconSelected: BRAND_GREEN,
    shadow: "#000000",
  },
  dark: {
    text: "#F9FAFB",
    textSecondary: "#9CA3AF",
    textMuted: "#6B7280",
    background: "#111827",
    backgroundMuted: "#1F2937",
    card: "#1F2937",
    inputBg: "#374151",
    border: "#374151",
    primary: BRAND_GREEN,
    primaryDark: "#2DB817",
    primaryTint: "#1A3D14",
    success: BRAND_GREEN,
    error: "#F87171",
    errorTint: "#450A0A",
    warning: BRAND_GREEN,
    tint: BRAND_GREEN,
    tabIconDefault: "#6B7280",
    tabIconSelected: BRAND_GREEN,
    shadow: "#000000",
  },
};

export const DEFAULT_SUBJECTS = [
  "Math",
  "Science",
  "English",
  "History",
  "Filipino",
  "Computer",
  "Other",
] as const;

/** @deprecated Use string — custom subjects are supported */
export type Subject = string;

export const cardShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 4,
};

export const inputShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 2,
};

export function mergeSubjects(
  defaults: readonly string[],
  custom: string[],
  fromTasks: string[] = [],
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const name of [...defaults, ...custom, ...fromTasks]) {
    const trimmed = name.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }

  return result;
}
