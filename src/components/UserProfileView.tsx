// biome-ignore-all lint/style/useNamingConvention: <Using snake_case for DB-shaped types>
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import EventFeed from "@/components/EventFeed";
import UserBioSection from "@/components/UserBioSection";
import UserGallery from "@/components/UserGallery";
import UserProfileHeader from "@/components/UserProfileHeader";
import { getPublicUrl } from "@/lib/getPublicURL";
import type { EnrichedEvent, UserProfileData } from "@/types/app.types";

export interface UserProfileViewProps {
  profile: UserProfileData;
  userEvents: EnrichedEvent[];
  userEventsLoading: boolean;
  userEventsError: boolean;
  isOwnProfile: boolean;
  onEditProfile: () => void;
}

export default function UserProfileView({
  profile,
  userEvents,
  userEventsLoading,
  userEventsError,
  isOwnProfile,
  onEditProfile,
}: UserProfileViewProps) {
  const normalizedGalleryPhotos = profile.galleryPhotos
    .map((p) => {
      const url = getPublicUrl("gallery-photos", p.photo_path);
      if (!url) return null;
      return { ...p, photo_path: url };
    })
    .filter((p): p is typeof p & { photo_path: string } => p !== null);

  const getPossessiveForm = (name: string): string => {
    return name.toLowerCase().endsWith("s")
      ? `${name}' Events`
      : `${name}'s Events`;
  };

  const eventsSectionTitle = getPossessiveForm(
    `${profile.user.first_name} ${profile.user.last_name}`.trim() || "User",
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <UserProfileHeader
          user={profile.user}
          tags={profile.tags}
          onEditProfile={isOwnProfile ? onEditProfile : undefined}
        />
      </Box>

      <UserBioSection bioText={profile.user.bio_text} />

      <UserGallery photos={normalizedGalleryPhotos} />

      <Box sx={{ mt: 2 }}>
        <Typography
          variant="h6"
          component="h2"
          fontWeight={600}
          sx={{ mb: 1.5 }}
        >
          {eventsSectionTitle}
        </Typography>
        {userEventsError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            Something went wrong while loading events.
          </Alert>
        ) : userEventsLoading ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "20vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <EventFeed
            events={userEvents}
            emptyMessage="No events yet. Create one from the Events tab!"
          />
        )}
      </Box>
    </Box>
  );
}
