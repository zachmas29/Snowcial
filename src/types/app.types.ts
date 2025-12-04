// biome-ignore-all lint/style/useNamingConvention: <Using snake_case for DB-shaped types>
import type { GenericTagType } from "@/types/EventCreator.types";
import type { AttendeeCountType } from "./AttendeeCountType.type";
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
  onEditProfile?: () => void;
}

export interface UserBioSectionProps {
  bioText?: string | null;
}

export interface UserGalleryProps {
  photos: {
    user_id: string;
    photo_path: string | null;
    created_at: string;
  }[];
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

export interface EnrichedEvent {
  event: Tables<"events">;
  user: Tables<"users"> | undefined;
  eventTags: Tables<"event_tags">[];
  attendingCount?: AttendeeCountType;
}

export interface EventFeedProps {
  events: EnrichedEvent[];
  searchTerm?: string;
  sortType?: string;
  selectedTags?: GenericTagType[];
  emptyMessage?: string;
  maxWidth?: number | string;
}
