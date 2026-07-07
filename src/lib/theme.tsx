"use client";

// Thème clair (par défaut) / sombre, au choix de l'utilisateur connecté.
// La préférence est mémorisée (localStorage). Le thème n'est appliqué qu'aux
// espaces applicatifs (via AppShell qui pose la classe `dark`) — le site public
// reste toujours clair.

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "seha.theme";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void; setTheme: (t: Theme) => void }>({
  theme: "light",
  toggle: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && (window.localStorage.getItem(KEY) as Theme)) || "light";
    setThemeState(stored === "dark" ? "dark" : "light");
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      window.localStorage.setItem(KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);

  return <ThemeContext.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
