export interface EventFormData {
  title: string;
  description: string;
  // biome-ignore lint/style/useNamingConvention: <Supabase wants snake_case>
  event_time: Date | null;
  tags: GenericTagType[];
  capacity?: number | null;
}

export interface GenericTagType {
  id: number;
  name: string;
}

export interface EventCreatorProps {
  initialData?: EventFormData;
  onSubmit: (data: EventFormData) => Promise<void>;
  handleClick: (action?: string) => void;
}
