/*
  UserBioSection.tsx

  Renders the bio section for a profile, splitting text into readable chunks.
*/

import { Box, Typography } from "@mui/material";
import type { UserBioSectionProps } from "@/types/app.types";

export function UserBioSection({ bioText }: UserBioSectionProps) {
  const paragraphs =
    bioText
      ?.split(/\r?\n/)
      .map((segment) => segment.trim())
      .filter((segment) => segment.length > 0) ?? [];

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        p: 2.5,
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h6" component="h2" fontWeight={600} mb={1.5}>
        Bio
      </Typography>

      {paragraphs.length > 0 ? (
        <Box component="ul" sx={{ m: 0, pl: 3 }}>
          {paragraphs.map((paragraph, index) => (
            <Typography
              key={`${index}-${paragraph.slice(0, 12)}`}
              component="li"
              variant="body1"
              sx={{ mb: index === paragraphs.length - 1 ? 0 : 1 }}
            >
              {paragraph}
            </Typography>
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No bio yet.
        </Typography>
      )}
    </Box>
  );
}

export default UserBioSection;
