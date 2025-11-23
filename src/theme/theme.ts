import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  colorSchemes: {
    dark: true, // Enable dark mode - MUI auto-generates background/text colors
  },
  palette: {
    primary: {
      main: "#667eea",
      light: "#8fa3f0",
      dark: "#4a5fc7",
    },
    secondary: {
      main: "#764ba2",
      light: "#9575cd",
      dark: "#5e3a7a",
    },
  },
  typography: {
    fontFamily: ["Roboto", "Arial", "Helvetica", "sans-serif"].join(","),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  spacing: 8, // Default MUI spacing unit
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: "md", // Default to 'md' (900px) for most pages
      },
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          "@media (min-width: 600px)": {
            paddingLeft: 24,
            paddingRight: 24,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Disable uppercase by default
        },
      },
    },
  },
});
