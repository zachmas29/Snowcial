import {
  Box,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { getPublicUrl } from "@/lib/getPublicURL";
import type { Tables } from "@/types/database.types";

export interface EditProfileGalleryProps {
  photos: Tables<"gallery_photos">[];
  maxPhotos?: number;
  onAddPhoto: (file: File) => void;
  onDeletePhoto: (photoPath: string) => void;
  disabled?: boolean;
}

export default function EditProfileGallery({
  photos,
  maxPhotos = 6,
  onAddPhoto,
  onDeletePhoto,
  disabled = false,
}: EditProfileGalleryProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAddPhoto(file);
    }
  };

  const remainingSlots = Math.max(0, maxPhotos - photos.length);

  return (
    <Box sx={{ px: 4, pb: 4 }}>
      <Typography variant="h6" fontWeight={700} textAlign="center" mb={2}>
        Gallery ({photos.length}/{maxPhotos})
      </Typography>

      {photos.length > 0 && (
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
          {photos.map((photo) => {
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
                  <IconButton
                    onClick={() => onDeletePhoto(photo.photo_path)}
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

      {photos.length < maxPhotos && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button
            component="label"
            variant="outlined"
            disabled={disabled}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
          >
            + Add Photo{remainingSlots > 1 ? "s" : ""}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
        </Box>
      )}
    </Box>
  );
}
