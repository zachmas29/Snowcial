import { Box, ImageList, ImageListItem, Typography } from "@mui/material";
import Image from "next/image";
import type { UserGalleryProps } from "@/types/app.types";

export default function UserGallery({ photos }: UserGalleryProps) {
  const showEmptyState = photos.length === 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" component="h2" fontWeight={600} mb={1.5}>
        Gallery
      </Typography>

      {showEmptyState ? (
        <Box
          sx={{
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "divider",
            p: 2,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          No photos yet.
        </Box>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <ImageList
            cols={3}
            gap={14}
            rowHeight={200}
            sx={{
              width: "100%",
              maxWidth: 650,
              "& .MuiImageListItem-root": {
                width: 200,
                height: 200,
                borderRadius: 3,
                overflow: "hidden",
              },
            }}
          >
            {photos.slice(0, 6).map((photo) => {
              // FIX: prevent Next.js Image crash
              if (!photo.photo_path) return null;

              return (
                <ImageListItem key={`${photo.user_id}-${photo.photo_path}`}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Image
                      src={photo.photo_path}
                      alt="Gallery photo"
                      fill
                      sizes="200px"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </ImageListItem>
              );
            })}
          </ImageList>
        </Box>
      )}
    </Box>
  );
}
