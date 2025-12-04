import { Box, CircularProgress } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { useAuthContext } from "@/hooks/useAuth";

export default function Profile() {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      void router.replace(`/profile/${user.id}`);
    }
  }, [router, user]);

  return (
    <>
      <Head>
        <title>Profile | Snowcial</title>
      </Head>
      <PageLayout>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "40vh",
          }}
        >
          <CircularProgress />
        </Box>
      </PageLayout>
    </>
  );
}
