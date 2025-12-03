//biome-ignore-all lint/style/useNamingConvention: <Using snake_case for DB types to make Supabase happy>
import { Alert, Box, CircularProgress, Paper } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { EditProfileFormValues } from "@/components/EditProfileForm";
import EditProfileForm from "@/components/EditProfileForm";
import EditProfileGallery from "@/components/EditProfileGallery";
import EditProfileHeader from "@/components/EditProfileHeader";
import PageLayout from "@/components/PageLayout";
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

        if (profileResult.error) {
          throw profileResult.error;
        }

        if (profileResult.data) {
          setProfile(profileResult.data);

          if (profileResult.data.profile_photo_path) {
            const photoUrl = getPublicUrl(
              "profile-photos",
              profileResult.data.profile_photo_path,
            );
            setPhoto(photoUrl);
          }

          if (profileResult.data.banner_photo_path) {
            const bannerUrl = getPublicUrl(
              "banner-photos",
              profileResult.data.banner_photo_path,
            );
            setBanner(bannerUrl);
          }
        }

        if (galleryResult.error) {
          throw galleryResult.error;
        }
        setGalleryPhotos(galleryResult.data || []);

        const allTags: GenericTagType[] = tagOptions.map((t) => ({
          id: t.id,
          name: t.name,
        }));
        setAvailableTags(allTags);

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

    void fetchAllData();
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

      let photoPath = profile.profile_photo_path || null;
      if (file) {
        // We intentionally do not delete any existing
        // profile photo object in storage. A new object
        // is uploaded and the users row is updated.
        photoPath = await uploadProfileImage(userId, file);
      }

      let bannerPath = profile.banner_photo_path || null;
      if (bannerFile) {
        // Same approach for banner photos: upload a new
        // object and point the profile at it, without
        // attempting to remove the previous object.
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

      const tagIds = selectedTags.map((tag) => tag.id);
      await updateUserTagAssignments(userId, tagIds);

      router.push(`/profile/${userId}`);
    } catch (_err) {
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const handleChangeProfileForm = (patch: Partial<EditProfileFormValues>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  };

  const handleChangeProfilePhoto = (newFile: File) => {
    setFile(newFile);
    setPhoto(URL.createObjectURL(newFile));
  };

  const handleChangeBannerPhoto = (newFile: File) => {
    setBannerFile(newFile);
    setBanner(URL.createObjectURL(newFile));
  };

  async function handleAddGalleryPhoto(file: File) {
    if (!authData.user) return;

    try {
      const imagePath = await uploadGalleryImage(authData.user.id, file);

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

  const formValues: EditProfileFormValues = {
    first_name: profile.first_name ?? "",
    last_name: profile.last_name ?? "",
    bio_text: profile.bio_text ?? "",
  };

  return (
    <>
      <Head>
        <title>Edit Profile | Snowcial</title>
      </Head>
      <PageLayout>
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
          {error && (
            <Box sx={{ px: 4, pt: 2 }}>
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Box>
          )}

          <EditProfileHeader
            bannerUrl={banner}
            photoUrl={photo}
            onChangeProfilePhoto={handleChangeProfilePhoto}
            onChangeBannerPhoto={handleChangeBannerPhoto}
          />

          <Box sx={{ p: 4 }}>
            <EditProfileForm
              values={formValues}
              onChange={handleChangeProfileForm}
              availableTags={availableTags}
              selectedTags={selectedTags}
              onChangeTags={setSelectedTags}
              saving={saving}
              isSaveDisabled={isSaveDisabled}
              onSubmit={saveProfile}
              onCancel={() => {
                if (authData.user) {
                  void router.push(`/profile/${authData.user.id}`);
                } else {
                  router.back();
                }
              }}
            />
          </Box>

          <EditProfileGallery
            photos={galleryPhotos}
            maxPhotos={6}
            disabled={saving}
            onAddPhoto={handleAddGalleryPhoto}
            onDeletePhoto={handleDeleteGalleryPhoto}
          />
        </Paper>
      </PageLayout>
    </>
  );
}
