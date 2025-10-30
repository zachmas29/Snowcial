/*
  UserGallery.tsx

  Displays a responsive gallery grid for a user's photo collection.
*/

import { Box, ImageList, ImageListItem, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import type { Tables } from "@/types/database.types";

export interface UserGalleryProps {
  photos: Tables<"gallery_photos">[];
}

export function UserGallery({ photos }: UserGalleryProps) {
  const showEmptyState = photos.length === 0;
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const columns = isMdUp ? 4 : isSmUp ? 3 : 2;

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
        <ImageList
          cols={columns}
          gap={12}
          rowHeight={160}
          sx={{
            m: 0,
            "& .MuiImageListItem-root": {
              borderRadius: 2,
              overflow: "hidden",
            },
            "& img": {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            },
          }}
        >
          {photos.map((photo) => (
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
                  sizes="(min-width: 900px) 25vw, (min-width: 600px) 33vw, 50vw"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </Box>
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
}

export default UserGallery;
