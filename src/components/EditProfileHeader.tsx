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
            onChange={handleProfileInputChange}
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
          onChange={handleBannerInputChange}
        />
      </Button>
    </Box>
  );
}
