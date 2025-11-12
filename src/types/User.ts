import type { Tables } from "@/types/database.types";

export type UserWithTags = Tables<"users"> & {
  tags: Tables<"user_tags">[];
};
