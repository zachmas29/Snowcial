/** biome-ignore-all lint/style/useNamingConvention: <snake_case to make Supabase happy> */
import { Avatar, type SxProps, type Theme } from "@mui/material";
import Link from "next/link";
import { getPublicUrl } from "@/lib/getPublicURL";
import type { Tables } from "@/types/database.types";

// Minimal user type for avatar rendering
export interface UserAvatarUser {
  id: string;
  first_name: string;
  last_name: string;
  profile_photo_path?: string | null;
}

interface UserAvatarProps {
  user: Tables<"users"> | UserAvatarUser | undefined;
  sx?: SxProps<Theme> | undefined;
  shouldLink?: boolean;
  fallbackInitials?: string;
}

export default function UserAvatar({
  user,
  sx,
  shouldLink = true,
  fallbackInitials = "",
}: UserAvatarProps) {
  const initials = user
    ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`
    : fallbackInitials || "?";

  // Normalize avatar URL from user object (Google users or storage keys)
  let avatarUrl = user?.profile_photo_path ?? undefined;

  if (avatarUrl && !avatarUrl.startsWith("http")) {
    const publicUrl = getPublicUrl("profile-photos", avatarUrl);
    avatarUrl = publicUrl ?? undefined;
  }

  const avatarElement = (
    <Avatar
      sx={{
        ...sx,
        ...(!user && {
          bgcolor: "grey.400",
          color: "grey.600",
        }),
      }}
      src={user ? avatarUrl : undefined}
    >
      {(!avatarUrl || !user) && initials}
    </Avatar>
  );

  if (!shouldLink || !user) {
    return avatarElement;
  }

  return (
    <Link href={`/profile/${user.id}`} onClick={(e) => e.stopPropagation()}>
      {avatarElement}
    </Link>
  );
}
