import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { useEffect } from "react";

export function ThemeToggle() {
  const { mode, setMode, systemMode } = useColorScheme();

  // On first load, set to system preference if still on default
  useEffect(() => {
    if (mode === "dark" && systemMode) {
      // Only change if we're still on the default and system mode is available
      const hasUserPreference = localStorage.getItem("mui-color-scheme");
      if (!hasUserPreference) {
        setMode(systemMode);
      }
    }
  }, [mode, systemMode, setMode]);

  const handleToggle = () => {
    // Simple toggle between light and dark only
    setMode(mode === "dark" ? "light" : "dark");
  };

  const getNextMode = () => {
    return mode === "dark" ? "light mode" : "dark mode";
  };

  const getIcon = () => {
    // Show the icon for what will happen next
    return mode === "dark" ? <LightMode /> : <DarkMode />;
  };

  return (
    <Tooltip title={`Switch to ${getNextMode()}`}>
      <IconButton onClick={handleToggle} color="inherit" size="large">
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
}
