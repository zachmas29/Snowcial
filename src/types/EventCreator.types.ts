export interface EventFormData {
  title: string;
  description: string;
  // biome-ignore lint/style/useNamingConvention: <Supabase wants snake_case>
  event_time: Date | null;
  tags: GenericTagType[] | [];
}

export interface GenericTagType {
  id: number;
  name: string;
}
