/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case to make Supabase happy> */

/*
 * EventCreator.tsx
 * If no initial data is passed, operates as 
 * an event creator, otherwise will prefill the 
 * form data and be in edit mode.

*/

import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers-pro";
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
  handleClick,
}: EventCreatorProps) {
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

  const typedTagOptions = tagOptions as GenericTagType[];

  const isEditMode = initialData !== undefined;
  const submitText = isEditMode ? "Save" : "Create";

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Stack spacing={2} width="100%">
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
        <TextField
          label="Event Capacity"
          type="number"
          value={eventFormData.capacity ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            setEventFormData({
              ...eventFormData,
              capacity: value === "" ? null : Math.max(1, Number.parseInt(value, 10)),
            });
          }}
          placeholder="Unlimited"
          slotProps={{
            input: {
              inputProps: { min: 1 },
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Maximum number of 'yes' RSVPs. 'Maybe' responses don't count.">
                    <IconButton size="small">
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            },
          }}
          helperText="Leave empty for unlimited capacity"
        />
        <TagSelector
          availableTags={typedTagOptions}
          selectedTags={eventFormData.tags}
          setSelectedTags={(tags) =>
            setEventFormData({ ...eventFormData, tags })
          }
          label="Add Event Tags"
        />
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => handleClick("cancel")}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => onSubmit(eventFormData)}
            disabled={!eventFormData.title || !eventFormData.description}
          >
            {submitText}
          </Button>
          {isEditMode && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleClick("delete")}
            >
              Delete
            </Button>
          )}
        </Stack>
        {(!eventFormData.title || !eventFormData.description) && (
          <Alert severity="error">
            Event name and description are required!
          </Alert>
        )}
      </Stack>
    </Box>
  );
}
