/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from "react-native";

export const COLORS = {
  light: {
    text: "#000000",
    background: "#FFFFFF",
    primary: "#4CAF50",
    secondary: "#2196F3",
    error: "#F44336",
    success: "#4CAF50",
    warning: "#FFC107",
    info: "#2196F3",
  },
  dark: {
    text: "#FFFFFF",
    background: "#121212",
    primary: "#81C784",
    secondary: "#64B5F6",
    error: "#E57373",
    success: "#81C784",
    warning: "#FFD54F",
    info: "#64B5F6",
  },
};

export type ColorName = keyof typeof COLORS.light;

export function useThemeColor(colorName: ColorName) {
  const scheme = useColorScheme();
  return COLORS[scheme === "dark" ? "dark" : "light"][colorName];
}
