import GoogleIcon from "@mui/icons-material/Google";
import { Alert, Box, Button } from "@mui/material";
import { useAuthContext } from "@/hooks/useAuth";

export function LoginButton() {
  const { signIn, error } = useAuthContext();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Button
        variant="contained"
        size="large"
        startIcon={<GoogleIcon />}
        onClick={signIn}
        sx={{
          backgroundColor: "#4285F4",
          "&:hover": {
            backgroundColor: "#357ae8",
          },
          textTransform: "none",
          fontSize: "1.1rem",
          padding: "12px 24px",
        }}
      >
        Sign in with Google
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
