import { Avatar, type SxProps, type Theme } from "@mui/material";
import Link from "next/link";
import type { Tables } from "@/types/database.types";

interface UserAvatarProps {
  user: Tables<"users"> | undefined;
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
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`
    : fallbackInitials;

  const avatarElement = <Avatar sx={sx}>{initials}</Avatar>;

  if (!shouldLink || !user) {
    return avatarElement;
  }

  return (
    <Link href={`/profile/${user.id}`} onClick={(e) => e.stopPropagation()}>
      {avatarElement}
    </Link>
  );
}
