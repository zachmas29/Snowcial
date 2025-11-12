/*
 * Renders a large event component
*/

import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import type { EventFormData } from "@/types/EventCreator.types";

/*

export interface EventFormData {
  title: string;
  description: string;
  // biome-ignore lint/style/useNamingConvention: <Supabase wants snake_case>
  event_time: Date | null;
  tags: GenericTagType[];
}

*/

// will need to ensure all event data uses same type eventually
interface EventProps {
    eventData: EventFormData;
}

export default function Event({ eventData }: EventProps) {
    const { title, description, event_time, tags } = eventData;

    return (
        <Card
            sx={{
                width: "100%",
                maxWidth: 640,
                borderRadius: 3,
                boxShadow: 2,
                mx: "auto",
            }}
        >
            <CardContent
                sx={{
                    p: 3,
                }}
            >
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                    {title}
                </Typography>

                {description && (
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            overflowWrap: "anywhere",
                            wordBreak: "break-word",
                        }}
                    >
                        {description}
                    </Typography>
                )}

                {event_time && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        {new Date(event_time).toLocaleString()}
                    </Typography>
                )}

                {tags && tags.length > 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.75,
                        }}
                    >
                        {tags.map((tag, index) => (
                            <Chip
                                key={tag.id || index}
                                label={tag.name}
                                size="small"
                                variant="outlined"
                                sx={{
                                    height: 22,
                                    fontSize: "0.75rem",
                                    px: 0.75,
                                }}
                            />
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}