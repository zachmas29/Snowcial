import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UserBioSection from "@/components/UserBioSection";
import UserGallery from "@/components/UserGallery";
import UserProfileHeader from "@/components/UserProfileHeader";
import type { UserProfileData } from "@/lib/db_functions";
import { fetchUserProfile } from "@/lib/db_functions";
import styles from "@/styles/Home.module.css";

export default function UserProfilePage() {
  const router = useRouter();
  const idParam = router.query.id;
  const parsedId =
    typeof idParam === "string" ? Number.parseInt(idParam, 10) : Number.NaN;

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (Number.isNaN(parsedId)) {
      setError("Invalid profile id.");
      setLoading(false);
      return;
    }

    async function loadProfile(userId: number) {
      try {
        setLoading(true);
        const data = await fetchUserProfile(userId);

        if (!data) {
          setError("We couldn't find that profile.");
          return;
        }

        setProfile(data);
        setError(null);
      } catch (fetchError) {
        // biome-ignore lint/suspicious/noConsole: helpful during development
        console.error("Failed to fetch profile:", fetchError);
        setError("Something went wrong while loading this profile.");
      } finally {
        setLoading(false);
      }
    }

    void loadProfile(parsedId);
  }, [parsedId, router.isReady]);

  const pageTitle = profile
    ? `${profile.user.first_name} ${profile.user.last_name} | Snowcial`
    : "Profile | Snowcial";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
            {loading ? (
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
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : profile ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <UserProfileHeader user={profile.user} tags={profile.tags} />
                <UserBioSection bioText={profile.user.bio_text} />
                <UserGallery photos={profile.galleryPhotos} />
              </Box>
            ) : (
              <Typography color="text.secondary">
                No profile data available.
              </Typography>
            )}
          </Container>
        </main>
      </div>
    </>
  );
}
