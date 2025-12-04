import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Theme } from "@mui/material/styles";
import {
  auroraTheme,
  xAuroraDarkTheme,
  xAuroraLightTheme,
  auroraCharcoalTheme,
  auroraRandomTheme,
} from "@acentra/aurora-design-system";
import { usersService } from "@/services/usersService";

type ThemeType =
  | "aurora"
  | "auroraDark"
  | "auroraLight"
  | "auroraCharcoal"
  | "auroraRandom";

interface ThemeContextType {
  currentTheme: ThemeType;
  theme: Theme;
  setTheme: (theme: ThemeType) => void;
  loadUserPreferences: (userId: string) => Promise<void>;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_THEME: ThemeType = "aurora";
const THEME_STORAGE_KEY = "acentra-theme";

const themeMap: Record<ThemeType, Theme> = {
  aurora: auroraTheme,
  auroraDark: xAuroraDarkTheme,
  auroraLight: xAuroraLightTheme,
  auroraCharcoal: auroraCharcoalTheme,
  auroraRandom: auroraRandomTheme,
};

// Helper functions for localStorage
const getStoredTheme = (): ThemeType | null => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored && themeMap[stored as ThemeType]
      ? (stored as ThemeType)
      : null;
  } catch {
    return null;
  }
};

const setStoredTheme = (theme: ThemeType): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error("Failed to save theme to localStorage:", error);
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    // Initialize with localStorage value or default
    return getStoredTheme() || DEFAULT_THEME;
  });
  const [userId, setUserId] = useState<string | null>(null);

  // Load user preferences from backend and sync with localStorage
  const loadUserPreferences = useCallback(async (uid: string) => {
    try {
      setUserId(uid);
      const response = await usersService.getUserPreferences(uid);
      const apiTheme = response.preferences?.theme as ThemeType;

      if (apiTheme && themeMap[apiTheme]) {
        const storedTheme = getStoredTheme();

        // If API theme differs from stored theme, update localStorage and apply
        if (storedTheme !== apiTheme) {
          setStoredTheme(apiTheme);
          setCurrentTheme(apiTheme);
        }
        // If no stored theme exists, save the API theme to localStorage
        else if (!storedTheme) {
          setStoredTheme(apiTheme);
          setCurrentTheme(apiTheme);
        }
        // If stored theme matches API, no change needed
      }
    } catch (error) {
      console.error("Failed to load user preferences:", error);
      // Keep current theme on error
    }
  }, []);

  // Save theme to localStorage immediately and backend when user is logged in
  const setTheme = useCallback(
    async (theme: ThemeType) => {
      setCurrentTheme(theme);
      setStoredTheme(theme);

      if (userId) {
        try {
          await usersService.updateUserPreferences(userId, { theme });
        } catch (error) {
          console.error("Failed to save theme preference:", error);
        }
      }
    },
    [userId],
  );

  // Reset theme to default (used on logout)
  const resetTheme = useCallback(() => {
    setCurrentTheme(DEFAULT_THEME);
    setUserId(null);
    // Clear localStorage on logout to allow fresh start
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear theme from localStorage:", error);
    }
  }, []);

  const value: ThemeContextType = {
    currentTheme,
    theme: themeMap[currentTheme],
    setTheme,
    loadUserPreferences,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
