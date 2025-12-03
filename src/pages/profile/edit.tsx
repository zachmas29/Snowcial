//biome-ignore-all lint/style/useNamingConvention: <Using snake_case for DB types to make Supabase happy>
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { useTheme } from "@mui/material/styles";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout";
import TagSelector from "@/components/TagSelector";
import { useAuthContext } from "@/hooks/useAuth";
import {
  deleteGalleryPhoto,
  fetchUserTagOptions,
  updateCurrentUserProfile,
  updateUserTagAssignments,
} from "@/lib/db_functions";
import { getPublicUrl } from "@/lib/getPublicURL";
import {
  uploadBannerImage,
  uploadGalleryImage,
  uploadProfileImage,
} from "@/lib/storage_functions";
import { supabase } from "@/lib/supabase_client";
import type { Tables } from "@/types/database.types";
import type { GenericTagType } from "@/types/EventCreator.types";

export default function EditProfilePage() {
  const authData = useAuthContext();
  const router = useRouter();
  const theme = useTheme();

  const [profile, setProfile] = useState<Partial<Tables<"users">>>({
    id: undefined,
    first_name: "",
    last_name: "",
    bio_text: "",
  });

  const [photo, setPhoto] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [galleryPhotos, setGalleryPhotos] = useState<
    Tables<"gallery_photos">[]
  >([]);

  const [banner, setBanner] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [availableTags, setAvailableTags] = useState<GenericTagType[]>([]);
  const [selectedTags, setSelectedTags] = useState<GenericTagType[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Consolidated data fetching with Promise.all
  useEffect(() => {
    async function fetchAllData() {
      if (!authData.user) return;

      try {
        setLoading(true);
        setError(null);

        const [profileResult, galleryResult, tagOptions, assignmentsResult] =
          await Promise.all([
            supabase
              .from("users")
              .select("*")
              .eq("id", authData.user.id)
              .single(),
            supabase
              .from("gallery_photos")
              .select("*")
              .eq("user_id", authData.user.id)
              .order("created_at", { ascending: false }),
            fetchUserTagOptions(),
            supabase
              .from("user_tag_assignments")
              .select("tag_id")
              .eq("user_id", authData.user.id),
          ]);

        // Handle profile data
        if (profileResult.error) {
          throw profileResult.error;
        }

        if (profileResult.data) {
          setProfile(profileResult.data);

          // Get profile photo URL (handles both Google URLs and storage paths)
          if (profileResult.data.profile_photo_path) {
            const photoUrl = getPublicUrl(
              "profile-photos",
              profileResult.data.profile_photo_path,
            );
            setPhoto(photoUrl);
          }

          // Get banner photo URL (handles both Google URLs and storage paths)
          if (profileResult.data.banner_photo_path) {
            const bannerUrl = getPublicUrl(
              "banner-photos",
              profileResult.data.banner_photo_path,
            );
            setBanner(bannerUrl);
          }
        }

        // Handle gallery data
        if (galleryResult.error) {
          throw galleryResult.error;
        }
        setGalleryPhotos(galleryResult.data || []);

        // Handle tags data via helper
        const allTags: GenericTagType[] = tagOptions.map((t) => ({
          id: t.id,
          name: t.name,
        }));
        setAvailableTags(allTags);

        // Handle tag assignments
        if (assignmentsResult.error) {
          throw assignmentsResult.error;
        }
        const assignedTagIds =
          assignmentsResult.data?.map((r) => r.tag_id) || [];
        const assignedTags = allTags.filter((tag) =>
          assignedTagIds.includes(tag.id),
        );
        setSelectedTags(assignedTags);
      } catch (_err) {
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, [authData.user]);

  async function saveProfile() {
    if (!authData.user) return;

    try {
      setSaving(true);
      setError(null);

      const userId = authData.user.id;

      const firstName = (profile.first_name ?? "").trim();
      const lastName = (profile.last_name ?? "").trim();
      const bioText = profile.bio_text ?? "";

      if (!firstName || !lastName) {
        setError("First and last name are required.");
        setSaving(false);
        return;
      }

      // Upload new profile photo if user selected one
      let photoPath = profile.profile_photo_path || null;
      if (file) {
        photoPath = await uploadProfileImage(userId, file);
      }

      // Upload new banner photo if user selected one
      let bannerPath = profile.banner_photo_path || null;
      if (bannerFile) {
        bannerPath = await uploadBannerImage(userId, bannerFile);
      }

      await updateCurrentUserProfile({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        bio_text: bioText,
        profile_photo_path: photoPath,
        banner_photo_path: bannerPath,
      });

      // Update tag assignments
      const tagIds = selectedTags.map((tag) => tag.id);
      await updateUserTagAssignments(userId, tagIds);

      router.push(`/profile/${userId}`);
    } catch (_err) {
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPhoto(URL.createObjectURL(file));
    }
  }

  function handleBannerFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBanner(URL.createObjectURL(file));
    }
  }

  async function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!authData.user) return;

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imagePath = await uploadGalleryImage(authData.user.id, file);

      // Fetch the newly created record
      const { data: newPhoto, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .eq("user_id", authData.user.id)
        .eq("photo_path", imagePath)
        .single();

      if (error || !newPhoto) {
        throw new Error("Failed to fetch uploaded photo");
      }

      setGalleryPhotos((prev) => [newPhoto, ...prev]);
    } catch (_err) {
      setError("Failed to upload photo. Please try again.");
    }
  }

  async function handleDeleteGalleryPhoto(photoPath: string) {
    if (!authData.user) return;

    try {
      await deleteGalleryPhoto(authData.user.id, photoPath);
      setGalleryPhotos((prev) =>
        prev.filter((p) => p.photo_path !== photoPath),
      );
    } catch (_err) {
      setError("Failed to delete photo. Please try again.");
    }
  }

  if (loading) {
    return (
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
    );
  }

  const firstNameValue = (profile.first_name ?? "").trim();
  const lastNameValue = (profile.last_name ?? "").trim();
  const isSaveDisabled = saving || !firstNameValue || !lastNameValue;

  return (
    <>
      <Head>
        <title>Edit Profile | Snowcial</title>
      </Head>
      <PageLayout maxWidth="sm">
        <Typography
          variant="h3"
          component="h1"
          fontWeight={600}
          textAlign="center"
          mb={1}
        >
          Edit Profile
        </Typography>
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: 3,
            border: 1,
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          {/* Error Banner */}
          {error && (
            <Box sx={{ px: 4, pt: 2 }}>
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Box>
          )}

          {/* Banner */}
          <Box
            sx={{
              width: "100%",
              height: 160,
              position: "relative",
              backgroundImage: banner
                ? `url(${banner})`
                : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              overflow: "hidden",
            }}
          >
            {/* Profile Photo (Left) */}
            <Box
              sx={{
                width: 140,
                height: 140,
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "background.default",
                position: "absolute",
                left: 24,
                top: "50%",
                transform: "translateY(-50%)",
                boxShadow: 4,
              }}
            >
              {photo ? (
                <Box
                  component="img"
                  src={photo}
                  alt="Profile preview"
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "background.default",
                    color: "text.secondary",
                    fontSize: "0.875rem",
                  }}
                >
                  No photo
                </Box>
              )}
              <Button
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  minWidth: 0,
                  backgroundColor: "white",
                  border: "2px solid black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                ✎
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </Box>

            {/* Banner edit button */}
            <Button
              component="label"
              sx={{
                position: "absolute",
                bottom: 10,
                right: 10,
                width: 40,
                height: 40,
                borderRadius: "50%",
                minWidth: 0,
                backgroundColor: "white",
                border: "2px solid black",
                color: "black",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              ✎
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleBannerFileChange}
              />
            </Button>
          </Box>

          {/* Main Form */}
          <Box sx={{ p: 4 }}>
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                saveProfile();
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: 500,
                mx: "auto",
              }}
            >
              <Stack spacing={3}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  value={profile.first_name}
                  onChange={(e) =>
                    setProfile({ ...profile, first_name: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  variant="outlined"
                  value={profile.last_name}
                  onChange={(e) =>
                    setProfile({ ...profile, last_name: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  label="Bio"
                  variant="outlined"
                  multiline
                  minRows={3}
                  value={profile.bio_text}
                  onChange={(e) =>
                    setProfile({ ...profile, bio_text: e.target.value })
                  }
                  fullWidth
                />

                {/* Tags */}
                <TagSelector
                  availableTags={availableTags}
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                  label="Choose tags"
                />

                {(!firstNameValue || !lastNameValue) && (
                  <Alert severity="error">
                    First and last name are required.
                  </Alert>
                )}

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    type="button"
                    variant="outlined"
                    disabled={saving}
                    onClick={() => {
                      if (authData.user) {
                        void router.push(`/profile/${authData.user.id}`);
                      } else {
                        router.back();
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSaveDisabled}
                  >
                    {saving ? <CircularProgress size={24} /> : "Save"}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Box>

          {/* Gallery - Moved to bottom */}

          <Box sx={{ px: 4, pb: 4 }}>
            <Typography variant="h6" fontWeight={700} textAlign="center" mb={2}>
              Gallery ({galleryPhotos.length}/6)
            </Typography>

            {galleryPhotos.length > 0 && (
              <ImageList
                cols={3}
                gap={12}
                rowHeight={240}
                sx={{
                  "& .MuiImageListItem-root": {
                    borderRadius: 2,
                    overflow: "hidden",
                  },
                }}
              >
                {galleryPhotos.map((photo) => {
                  const url = getPublicUrl("gallery-photos", photo.photo_path);
                  if (!url) return null;

                  return (
                    <ImageListItem key={photo.photo_path}>
                      <Box
                        sx={{
                          width: "100%",
                          height: 160,
                          position: "relative",
                          backgroundColor: "background.default",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          component="img"
                          src={url}
                          alt=""
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        {/* Delete button */}
                        <IconButton
                          onClick={() =>
                            handleDeleteGalleryPhoto(photo.photo_path)
                          }
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            width: 28,
                            height: 28,
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            color: "black",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 1)",
                            },
                          }}
                        >
                          ×
                        </IconButton>
                      </Box>
                    </ImageListItem>
                  );
                })}
              </ImageList>
            )}

            {/* Upload button (only if < 6 photos) */}
            {galleryPhotos.length < 6 && (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  component="label"
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                  }}
                >
                  + Add Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleGalleryChange}
                  />
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </PageLayout>
    </>
  );
}
