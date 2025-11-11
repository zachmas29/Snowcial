import "@/styles/globals.css";
import { Box, CircularProgress } from "@mui/material";
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import useAuth, { AuthContext } from "@/hooks/useAuth";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function App({ Component, pageProps }: AppProps) {
  const authData = useAuth();
  const router = useRouter();
  const isLoginPage = router.pathname === "/";

  // Redirect to login if not authenticated and not on login page
  useEffect(() => {
    if (!authData.loading && !authData.user && !isLoginPage) {
      router.push("/");
    }
  }, [authData.loading, authData.user, isLoginPage, router]);

  if (authData.loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Don't render protected pages if not authenticated
  if (!authData.user && !isLoginPage) {
    return null; // Will redirect
  }

  return (
    <AuthContext.Provider value={authData}>
      <AppCacheProvider {...pageProps}>
        <Component {...pageProps} />
        {authData.user && <NavBar />}
      </AppCacheProvider>
    </AuthContext.Provider>
  );
}
