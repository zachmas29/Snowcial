import { Typography } from "@mui/material";
import Head from "next/head";
import PageLayout from "@/components/PageLayout";
import { useAuthContext } from "@/hooks/useAuth";

export default function EditProfile() {
  const { user } = useAuthContext();

  return (
    <>
      <Head>
        <title>Edit Profile | Snowcial</title>
      </Head>
      <PageLayout maxWidth="sm">
        <Typography variant="h3" component="h1" fontWeight={600} textAlign="center">
          Edit Profile
        </Typography>
        <Typography variant="body1">{user?.user_metadata?.name}</Typography>
      </PageLayout>
    </>
  );
}
