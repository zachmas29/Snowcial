import type { Tables } from "./database.types";

export interface EventFormData {
  title: string;
  description: string;
  // biome-ignore lint/style/useNamingConvention: <Supabase wants snake_case>
  event_time: Date | null;
  tags: GenericTagType[];
}

export interface GenericTagType {
  id: number;
  name: string;
}

export interface EventCreatorProps {
  eventFormData: EventFormData;
  setEventFormData: (EventFormData: EventFormData) => void;
  tagOptions: Tables<"event_tags">[];
  submit: () => void;
  cancel: () => void;
}
