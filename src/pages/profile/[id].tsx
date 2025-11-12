import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import UserBioSection from "@/components/UserBioSection";
import UserGallery from "@/components/UserGallery";
import UserProfileHeader from "@/components/UserProfileHeader";
import { fetchUserProfile } from "@/lib/db_functions";
import styles from "@/styles/Home.module.css";
import type { UserProfileData } from "@/types/app.types";

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export default function UserProfilePage() {
  const router = useRouter();
  const userId = useMemo(() => {
    const { id } = router.query;
    if (typeof id === "string") {
      return id;
    }
    if (Array.isArray(id)) {
      return id[0];
    }
    return null;
  }, [router.query]);

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    let isMounted = true;

    if (!userId || !isValidUuid(userId)) {
      setProfile(null);
      setError("Invalid profile id.");
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    async function loadProfile(id: string) {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchUserProfile(id);

        if (!isMounted) {
          return;
        }

        if (!data) {
          setProfile(null);
          setError("We couldn't find that profile.");
          return;
        }

        setProfile(data);
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        // biome-ignore lint/suspicious/noConsole: helpful during development
        console.error("Failed to fetch profile:", fetchError);
        setProfile(null);
        setError("Something went wrong while loading this profile.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadProfile(userId);

    return () => {
      isMounted = false;
    };
  }, [router.isReady, userId]);

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
