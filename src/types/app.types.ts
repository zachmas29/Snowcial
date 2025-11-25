import type { GenericTagType } from "@/types/EventCreator.types";
import type { Tables } from "./database.types";
import type { UserWithTags } from "./User";

// Application-level shared types
export interface UserProfileData {
  user: Tables<"users">;
  tags: Tables<"user_tags">[];
  galleryPhotos: Tables<"gallery_photos">[];
}
// Component props
export interface UserProfileHeaderProps {
  user: Tables<"users">;
  tags: Tables<"user_tags">[];
}
export interface UserBioSectionProps {
  bioText?: string | null;
}
export interface UserGalleryProps {
  photos: Tables<"gallery_photos">[];
}
export interface SmallProfileCardProps {
  user: UserWithTags;
}
export interface PeopleFeedProps {
  users: UserWithTags[];
  emptyMessage?: string;
  spacing?: number;
  searchTerm: string;
  sortType: string;
  selectedTags: GenericTagType[];
}
