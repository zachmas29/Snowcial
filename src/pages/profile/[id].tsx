//biome-ignore-all lint/style/useNamingConvention: <Using snake_case for DB types to make Supabase happy>

import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Box,
  Button,
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
import {
  fetchEventsByUser,
  fetchEventTags,
  fetchUser,
  fetchUserProfile,
  getAttendeeCount,
} from "@/lib/db_functions";
import { getPublicUrl } from "@/lib/getPublicURL";
import type { EnrichedEvent, UserProfileData } from "@/types/app.types";

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

  const [userEvents, setUserEvents] = useState<EnrichedEvent[]>([]);
  const [userEventsLoading, setUserEventsLoading] = useState(true);
  const [userEventsError, setUserEventsError] = useState(false);

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

    async function loadUserEvents(validUserId: string) {
      setUserEventsLoading(true);
      setUserEventsError(false);

      try {
        const baseEvents = await fetchEventsByUser(validUserId);

        const enrichedPromises = baseEvents.map(async (event) => {
          try {
            const [eventUser, attendingCount, eventTags] = await Promise.all([
              fetchUser(event.creator_id),
              getAttendeeCount(event.id),
              fetchEventTags(event.id),
            ]);

            return {
              event,
              user: eventUser,
              eventTags,
              attendingCount,
            } as EnrichedEvent;
          } catch (_err) {
            return {
              event,
              user: undefined,
              eventTags: [],
              attendingCount: undefined,
            } as EnrichedEvent;
          }
        });

        const enrichedEvents = await Promise.all(enrichedPromises);

        if (isMounted) {
          setUserEvents(enrichedEvents);
        }
      } catch (_err) {
        if (isMounted) {
          setUserEventsError(true);
        }
      } finally {
        if (isMounted) {
          setUserEventsLoading(false);
        }
      }
    }

    async function loadProfile(validUserId: string) {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchUserProfile(validUserId);

        if (!isMounted) return;

        if (!data) {
          setProfile(null);
          setError("We couldn't find that profile.");
          return;
        }

        // convert stored paths into real public urls so images show up correctly
        if (data.user.profile_photo_path) {
          data.user.profile_photo_path = getPublicUrl(
            "profile-photos",
            data.user.profile_photo_path,
          );
        }

        // same idea for the banner image so it can load like the profile photo
        if (data.user.banner_photo_path) {
          data.user.banner_photo_path = getPublicUrl(
            "banner-photos",
            data.user.banner_photo_path,
          );
        }

        setProfile(data);
      } catch (_fetchError) {
        if (!isMounted) return;

        setProfile(null);
        setError("Something went wrong while loading this profile.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadProfile(userId);
    void loadUserEvents(userId);

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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <UserProfileHeader user={profile.user} tags={profile.tags} />
              {isOwnProfile && (
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => router.push("/profile/edit")}
                  >
                    Edit Profile
                  </Button>
                </Box>
              )}
            </Box>
            <UserBioSection bioText={profile.user.bio_text} />

            {/* convert each gallery photo so next/image can load them */}
            <UserGallery
              photos={profile.galleryPhotos
                .filter((p) => p.photo_path)
                .map((p) => ({
                  ...p,
                  photo_path: getPublicUrl(
                    "gallery-photos",
                    p.photo_path as string,
                  ),
                }))}
            />

            <Box>
              <Typography variant="h6" component="h2" fontWeight={600} mb={1.5}>
                {isOwnProfile
                  ? "My Events"
                  : getPossessiveForm(profile.user.first_name)}
              </Typography>

              {userEventsLoading ? (
                <CircularProgress />
              ) : userEventsError ? (
                <Alert severity="error">Could not load events</Alert>
              ) : (
                <EventFeed
                  events={userEvents}
                  emptyMessage="No events yet. Create your first event!"
                />
              )}
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
