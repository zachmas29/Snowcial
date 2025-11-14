/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case to make Supabase happy> */
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers-pro";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchEventTagOptions } from "@/lib/db_functions";
import type { Tables } from "@/types/database.types";
import type {
  EventCreatorProps,
  EventFormData,
  GenericTagType,
} from "@/types/EventCreator.types";
import TagSelector from "./TagSelector";

export default function EventCreator({
  initialData,
  onSubmit,
  onCancel,
}: EventCreatorProps) {
  const router = useRouter();
  const [tagOptions, setTagOptions] = useState<Tables<"event_tags">[]>([]);
  const [eventFormData, setEventFormData] = useState<EventFormData>(
    initialData || {
      title: "",
      description: "",
      event_time: new Date(),
      tags: [],
    },
  );

  useEffect(() => {
    async function loadEventTags() {
      try {
        const data = await fetchEventTagOptions();
        setTagOptions(data);
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: just for testing
        console.error("Failed to fetch tags:", error);
      }
    }
    loadEventTags();
  }, []);

  useEffect(() => {
    if (initialData) {
      setEventFormData(initialData);
    }
  }, [initialData]);

  const typedTagOptions = tagOptions as GenericTagType[];

  const isEditMode = router.pathname.includes("/edit");
  const submitText = isEditMode ? "Save" : "Create";

  return (
    <Box
      sx={{
        width: "600px",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Stack spacing={2} width="100%" maxWidth={800}>
        <TextField
          label="Event Name"
          value={eventFormData.title}
          onChange={(event) =>
            setEventFormData({ ...eventFormData, title: event.target.value })
          }
          required
        />
        <TextField
          label="Description"
          value={eventFormData.description}
          onChange={(event) =>
            setEventFormData({
              ...eventFormData,
              description: event.target.value,
            })
          }
          multiline
          rows={3}
          required
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Event Time"
            value={eventFormData.event_time}
            onChange={(newValue) =>
              setEventFormData({ ...eventFormData, event_time: newValue })
            }
          />
        </LocalizationProvider>
        <TagSelector
          availableTags={typedTagOptions}
          selectedTags={eventFormData.tags}
          setSelectedTags={(tags) =>
            setEventFormData({ ...eventFormData, tags })
          }
        />
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => onSubmit(eventFormData)}
            disabled={!eventFormData.title || !eventFormData.description}
          >
            {submitText}
          </Button>
          {(!eventFormData.title || !eventFormData.description) && (
            <Alert severity="error">
              Event name and description are required!
            </Alert>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
