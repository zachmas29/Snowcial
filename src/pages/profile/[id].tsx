import {
  Alert,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import EventFeed from "@/components/EventFeed";
import PageLayout from "@/components/PageLayout";
import UserBioSection from "@/components/UserBioSection";
import UserGallery from "@/components/UserGallery";
import UserProfileHeader from "@/components/UserProfileHeader";
import { useAuthContext } from "@/hooks/useAuth";
import { fetchUserProfile } from "@/lib/db_functions";
import type { UserProfileData } from "@/types/app.types";

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export default function UserProfilePage() {
  const router = useRouter();
  const id = router.query.id;
  const { user } = useAuthContext();
  const userId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : null;
  const isOwnProfile = user?.id === userId;

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // function to handle possessive grammar for names
  const getPossessiveForm = (name: string): string => {
    return name.toLowerCase().endsWith("s")
      ? `${name}' Events`
      : `${name}'s Events`;
  };

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!userId || !isValidUuid(userId)) {
      setProfile(null);
      setError("Invalid profile id.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadProfile(validUserId: string) {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchUserProfile(validUserId);

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
      <PageLayout>
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
            <Box>
              <Typography
                variant="h6"
                component="h2"
                fontWeight={600}
                mb={1.5}
              >
                {isOwnProfile
                  ? "My Events"
                  : getPossessiveForm(profile.user.first_name)}
              </Typography>
              <EventFeed includeUserId={userId || undefined} />
            </Box>
          </Box>
        ) : (
          <Typography color="text.secondary">
            No profile data available.
          </Typography>
        )}
      </PageLayout>
    </>
  );
}
