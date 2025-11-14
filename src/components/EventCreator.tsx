import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers-pro";
import { useRouter } from "next/router";
import type {
  EventCreatorProps,
  GenericTagType,
} from "@/types/EventCreator.types";
import TagSelector from "./TagSelector";

export default function EventCreator({
  eventFormData,
  setEventFormData,
  tagOptions,
  submit,
  cancel,
}: EventCreatorProps) {
  const router = useRouter();
  const typedTagOptions = tagOptions as GenericTagType[];

  // Determine if we're in edit mode based on the route
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
              // biome-ignore lint/style/useNamingConvention: <snake_case to keep supabase happy>
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
          <Button variant="outlined" onClick={cancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submit}
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
