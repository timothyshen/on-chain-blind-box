import { useState, useEffect } from "react";
import { Theme, themes } from "@/types/theme";

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [themesUsed, setThemesUsed] = useState<string[]>(["pastelDream"]);

  useEffect(() => {
    const savedThemeId = localStorage.getItem("gacha-theme");
    const savedTheme = themes.find((t) => t.id === savedThemeId);
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }

    const savedThemesUsed = localStorage.getItem("gacha-themes-used");
    if (savedThemesUsed) setThemesUsed(JSON.parse(savedThemesUsed));
  }, []);

  useEffect(() => {
    localStorage.setItem("gacha-theme", currentTheme.id);
    localStorage.setItem("gacha-themes-used", JSON.stringify(themesUsed));
  }, [currentTheme, themesUsed]);

  const changeTheme = (theme: Theme) => {
    setCurrentTheme(theme);

    if (!themesUsed.includes(theme.id)) {
      setThemesUsed((prev) => [...prev, theme.id]);
    }
  };

  return {
    currentTheme,
    themesUsed,
    changeTheme,
  };
};
