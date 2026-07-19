export const GRADIENT = ["#FF4D2E", "#FF7A00"] as const;
export const GRADIENT_SOFT = ["rgba(255,77,46,0.18)", "rgba(255,122,0,0.10)"] as const;

export type ThemeMode = "dark" | "light";

export type Palette = {
  bg: string;
  bgElevated: string;
  card: string;
  cardAlt: string;
  border: string;
  text: string;
  textMuted: string;
  textFaint: string;
  accent: string;
  accentDim: string;
  success: string;
  overlay: string;
  tabBar: string;
};

const dark: Palette = {
  bg: "#0D0D0F",
  bgElevated: "#141418",
  card: "#1A1A1E",
  cardAlt: "#212127",
  border: "rgba(255,255,255,0.07)",
  text: "#FFFFFF",
  textMuted: "#9A9AA4",
  textFaint: "#5C5C66",
  accent: "#FF5A2E",
  accentDim: "rgba(255,90,46,0.14)",
  success: "#34D07F",
  overlay: "rgba(0,0,0,0.6)",
  tabBar: "#111114",
};

const light: Palette = {
  bg: "#F4F4F6",
  bgElevated: "#FFFFFF",
  card: "#FFFFFF",
  cardAlt: "#EFEFF2",
  border: "rgba(0,0,0,0.08)",
  text: "#0D0D0F",
  textMuted: "#6A6A74",
  textFaint: "#9A9AA4",
  accent: "#FF4D2E",
  accentDim: "rgba(255,77,46,0.10)",
  success: "#1FA463",
  overlay: "rgba(0,0,0,0.4)",
  tabBar: "#FFFFFF",
};

export const palettes: Record<ThemeMode, Palette> = { dark, light };

export const RADIUS = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const SPACING = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
