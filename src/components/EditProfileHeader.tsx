import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export interface EditProfileHeaderProps {
  bannerUrl: string | null;
  photoUrl: string | null;
  onChangeProfilePhoto: (file: File) => void;
  onChangeBannerPhoto: (file: File) => void;
}

export default function EditProfileHeader({
  bannerUrl,
  photoUrl,
  onChangeProfilePhoto,
  onChangeBannerPhoto,
}: EditProfileHeaderProps) {
  const theme = useTheme();

  const handleProfileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      onChangeProfilePhoto(file);
    }
  };

  const handleBannerInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      onChangeBannerPhoto(file);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: 160,
        position: "relative",
        backgroundImage: bannerUrl
          ? `url(${bannerUrl})`
          : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      {/* Profile Photo (Left) */}
      <Box
        sx={{
          width: { xs: 96, sm: 104 },
          height: { xs: 96, sm: 104 },
          borderRadius: "50%",
          overflow: "hidden",
          backgroundColor: "background.default",
          position: "absolute",
          left: 24,
          top: "50%",
          transform: "translateY(-50%)",
          boxShadow: 4,
          border: "3px solid",
          borderColor: "background.paper",
        }}
      >
        {photoUrl ? (
          <Box
            component="img"
            src={photoUrl}
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
      </Box>

      {/* Profile photo action */}
      <Button
        component="label"
        variant="contained"
        size="small"
        sx={{
          position: "absolute",
          left: { xs: 24 + 96 / 2, sm: 24 + 104 / 2 },
          bottom: { xs: 8, sm: 12 },
          transform: "translateX(-50%)",
          textTransform: "none",
          boxShadow: 2,
        }}
      >
        Change photo
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleProfileInputChange}
          aria-label="Upload profile photo"
        />
      </Button>

      {/* Banner edit button */}
      <Button
        component="label"
        variant="contained"
        color="secondary"
        size="small"
        sx={{
          position: "absolute",
          bottom: { xs: 8, sm: 12 },
          right: { xs: 8, sm: 12 },
          textTransform: "none",
          boxShadow: 2,
        }}
      >
        Change banner
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleBannerInputChange}
          aria-label="Upload banner photo"
        />
      </Button>
    </Box>
  );
}
