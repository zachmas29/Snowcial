import { Typography } from "@mui/material";
import Head from "next/head";
import PageLayout from "@/components/PageLayout";
import { useAuthContext } from "@/hooks/useAuth";

export default function Profile() {
  const { user } = useAuthContext();

  return (
    <>
      <Head>
        <title>Profile | Snowcial</title>
      </Head>
      <PageLayout>
        <Typography
          variant="h3"
          component="h1"
          fontWeight={600}
          textAlign="center"
        >
          Profile
        </Typography>
        <Typography variant="body1">{user?.user_metadata?.name}</Typography>
      </PageLayout>
    </>
  );
}
