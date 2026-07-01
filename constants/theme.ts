export const BRAND_GREEN = "#3ADB1D";

export const Colors = {
  light: {
    text: "#0F172A",
    textSecondary: "#64748B",
    textMuted: "#94A3B8",
    background: "#F8FAFC",
    backgroundMuted: "#F1F5F9",
    card: "#FFFFFF",
    inputBg: "#F1F5F9",
    border: "#E2E8F0",
    primary: BRAND_GREEN,
    primaryDark: "#2DB817",
    primaryTint: "#E8FCE3",
    success: BRAND_GREEN,
    error: "#EF4444",
    errorTint: "#FEE2E2",
    warning: BRAND_GREEN,
    tint: BRAND_GREEN,
    tabIconDefault: "#94A3B8",
    tabIconSelected: BRAND_GREEN,
    shadow: "#000000",
  },
  dark: {
    text: "#F1F5F9",
    textSecondary: "#CBD5E1",
    textMuted: "#94A3B8",
    background: "#0F172A",
    backgroundMuted: "#1E293B",
    card: "#1E293B",
    inputBg: "#0F172A",
    border: "#334155",
    primary: BRAND_GREEN,
    primaryDark: "#2DB817",
    primaryTint: "#1A3D14",
    success: BRAND_GREEN,
    error: "#F87171",
    errorTint: "#450A0A",
    warning: BRAND_GREEN,
    tint: BRAND_GREEN,
    tabIconDefault: "#64748B",
    tabIconSelected: BRAND_GREEN,
    shadow: "#000000",
  },
};

// Spacing scale
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

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

// Professional shadow styles
export const cardShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 4,
};

export const cardShadowLarge = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 6,
};

export const tabBarShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 5,
};

export const buttonShadow = {
  shadowColor: "#3ADB1D",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 6,
};

export const inputShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
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
