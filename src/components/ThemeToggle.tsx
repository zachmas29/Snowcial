import { DarkMode, LightMode, SettingsBrightness } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

export function ThemeToggle() {
  const { mode, setMode } = useColorScheme();

  const handleToggle = () => {
    switch (mode) {
      case "system":
        setMode("light");
        break;
      case "light":
        setMode("dark");
        break;
      case "dark":
        setMode("system");
        break;
      default:
        setMode("light");
    }
  };

  const getNextMode = () => {
    switch (mode) {
      case "system":
        return "light mode";
      case "light":
        return "dark mode";
      case "dark":
        return "system mode";
      default:
        return "light mode";
    }
  };

  const getIcon = () => {
    switch (mode) {
      case "system":
        return <LightMode />; // Next: light mode
      case "light":
        return <DarkMode />; // Next: dark mode
      case "dark":
        return <SettingsBrightness />; // Next: system mode
      default:
        return <LightMode />;
    }
  };

  return (
    <Tooltip title={`Switch to ${getNextMode()}`}>
      <IconButton onClick={handleToggle} color="inherit" size="large">
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
}
