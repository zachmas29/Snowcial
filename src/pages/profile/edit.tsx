//biome-ignore-all lint/style/useNamingConvention: <Using snake_case for DB types to make Supabase happy>
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/hooks/useAuth";
import {
  updateCurrentUserProfile,
  uploadBannerPhoto,
  uploadGalleryPhoto,
  uploadProfilePhoto,
} from "@/lib/db_functions";
import { supabase } from "@/lib/supabase_client";
import type { Tables } from "@/types/database.types";

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

  const [tags, setTags] = useState<Tables<"user_tags">[]>([]);
  const [tagIds, setTagIds] = useState<number[]>([]);

  // fetch profile data
  useEffect(() => {
    async function fetchProfile() {
      if (!authData.user) return;

      const { data: profileData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (error) {
        console.log("error fetching profile", error);
      }

      if (profileData) {
        setProfile(profileData);

        if (profileData.profile_photo_path) {
          const { data } = supabase.storage
            .from("profile-photos")
            .getPublicUrl(profileData.profile_photo_path);

          setPhoto(data.publicUrl);

          setProfile((prev) => ({
            ...prev,
            profile_photo_path: profileData.profile_photo_path,
          }));
        }

        if (profileData.banner_photo_path) {
          const { data } = supabase.storage
            .from("banner-photos")
            .getPublicUrl(profileData.banner_photo_path);

          setBanner(data.publicUrl);

          setProfile((prev) => ({
            ...prev,
            banner_photo_path: profileData.banner_photo_path,
          }));
        }
      }
    }
    fetchProfile();
  }, [authData.user]);

  useEffect(() => {
    async function fetchGallery() {
      if (!authData.user) return;

      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .eq("user_id", authData.user.id)
        .order("created_at", { ascending: false });

      if (error) console.log(error);
      setGalleryPhotos(data || []);
    }
    fetchGallery();
  }, [authData.user]);

  useEffect(() => {
    async function getTags() {
      if (!authData.user) return;

      const { data: tagList } = await supabase.from("user_tags").select("*");

      setTags(tagList || []);

      const { data: assignmentRows } = await supabase
        .from("user_tag_assignments")
        .select("tag_id")
        .eq("user_id", authData.user.id);

      setTagIds(assignmentRows?.map((r) => r.tag_id) || []);
    }
    getTags();
  }, [authData.user]);

  async function saveProfile() {
    if (!authData.user) return;
    const userId = authData.user.id;

    let photoPath = profile.profile_photo_path || null;
    if (file) {
      photoPath = await uploadProfilePhoto(userId, file);
    }

    let bannerPath = profile.banner_photo_path || null;
    if (bannerFile) {
      bannerPath = await uploadBannerPhoto(userId, bannerFile);
    }

    const info: any = {};
    info.id = userId;
    info.first_name = profile.first_name || "";
    info.last_name = profile.last_name || "";
    info.bio_text = profile.bio_text || "";
    info.profile_photo_path = photoPath;
    info.banner_photo_path = bannerPath;

    await updateCurrentUserProfile(info);

    router.push("/profile");
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

    const newRow = await uploadGalleryPhoto(authData.user.id, file);
    setGalleryPhotos([newRow, ...galleryPhotos]);
  }

  if (!profile) return;

  //author: CHATGPT
  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        py: 6,
        px: 2,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 720,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Edit Profile Title */}
        <Box sx={{ textAlign: "center", pt: 3 }}>
          <Typography variant="h5" fontWeight={700}>
            Edit Profile
          </Typography>
        </Box>

        {/* Banner */}
        <Box
          sx={{
            width: "100%",
            height: 160,
            position: "relative",
            backgroundColor: "#ddd",
            overflow: "hidden",
          }}
        >
          {banner ? (
            <Box
              component="img"
              src={banner}
              alt="Banner preview"
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
                backgroundColor: "#e4e4e4",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {[...Array(20)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: "absolute",
                    top: -10,
                    left: `${Math.random() * 100}%`,
                    fontSize: `${Math.random() * 10 + 10}px`,
                    opacity: 0.8,
                    animation: `fall ${Math.random() * 3 + 3}s linear infinite`,
                    "@keyframes fall": {
                      "0%": { transform: "translateY(-20px)" },
                      "100%": { transform: "translateY(200px)" },
                    },
                  }}
                >
                  ❄
                </Box>
              ))}
            </Box>
          )}

          {/* Profile Photo (Left) */}
          <Box
            sx={{
              width: 140,
              height: 140,
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: "#eee",
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
                  backgroundColor: "#eaeaea",
                  position: "relative",
                }}
              >
                {[...Array(12)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: "absolute",
                      top: -10,
                      left: `${Math.random() * 100}%`,
                      fontSize: `${Math.random() * 8 + 8}px`,
                      opacity: 0.8,
                      animation: `fall2 ${Math.random() * 3 + 3}s linear infinite`,
                      "@keyframes fall2": {
                        "0%": { transform: "translateY(-20px)" },
                        "100%": { transform: "translateY(160px)" },
                      },
                    }}
                  >
                    ❄
                  </Box>
                ))}
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

        {/* Gallery */}
        <Box sx={{ px: 4, py: 3 }}>
          <Typography variant="h6" fontWeight={700} textAlign="center" mb={1}>
            Gallery
          </Typography>

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
            {[...Array(6)].map((_, i) => {
              const photo = galleryPhotos[i];
              if (!photo) {
                // placeholder with snow
                return (
                  <ImageListItem key={`placeholder-${i}`}>
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        backgroundColor: "#ccc",
                      }}
                    >
                      {[...Array(6)].map((__, j) => (
                        <Box
                          key={j}
                          sx={{
                            position: "absolute",
                            top: -10,
                            left: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 8 + 8}px`,
                            opacity: 0.8,
                            animation: `fallSnow ${Math.random() * 3 + 3}s linear infinite`,
                            "@keyframes fallSnow": {
                              "0%": { transform: "translateY(-20px)" },
                              "100%": { transform: "translateY(160px)" },
                            },
                          }}
                        >
                          ❄
                        </Box>
                      ))}
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
                          onChange={handleGalleryChange}
                        />
                      </Button>
                    </Box>
                  </ImageListItem>
                );
              }

              const { data: urlData } = supabase.storage
                .from("gallery-photos")
                .getPublicUrl(photo.photo_path);
              const url = urlData.publicUrl;

              return (
                <ImageListItem key={photo.photo_path}>
                  <Box
                    sx={{ width: "100%", height: "100%", position: "relative" }}
                  >
                    <Box
                      component="img"
                      src={url}
                      alt=""
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
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
                        onChange={handleGalleryChange}
                      />
                    </Button>
                  </Box>
                </ImageListItem>
              );
            })}
          </ImageList>
        </Box>

        {/* Tags */}
        <Box sx={{ px: 4, pb: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="tag-select-label">Choose tags</InputLabel>
            <Select
              labelId="tag-select-label"
              multiple
              value={tagIds}
              onChange={(e) => setTagIds(e.target.value as number[])}
              input={<OutlinedInput label="Choose tags" />}
              renderValue={(selected) =>
                selected
                  .map((id) => tags.find((t) => t.id === id)?.name ?? "")
                  .join(", ")
              }
            >
              {tags.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
              gap: 2,
              width: "100%",
              maxWidth: 500,
              mx: "auto",
            }}
          >
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
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 1,
                alignSelf: "center",
                textTransform: "none",
                borderRadius: 2,
                px: 4,
                py: 1,
                fontSize: "1rem",
                fontWeight: 600,
                backgroundColor: "black",
                color: "white",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
