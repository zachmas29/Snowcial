import { Box, useMediaQuery } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoginButton } from "@/components/LoginButton";
import { useAuthContext } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuthContext();
  const router = useRouter();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // Redirect authenticated users to the people page
  useEffect(() => {
    if (user) {
      router.push("/people");
    }
  }, [user, router]);

  if (user) {
    return null; // Will redirect
  }

  const logoSrc = prefersDarkMode
    ? "/snowcial_logo_cream.webp"
    : "/snowcial_logo_blue.webp";

  return (
    <>
      <Head>
        <title>Snowcial - Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 4,
        }}
      >
        <Image src={logoSrc} alt="Snowcial" width={400} height={400} priority />
        <LoginButton />
      </Box>
    </>
  );
}
