// biome-ignore-all lint/style/useNamingConvention: <Using snake_case field names to match DB user shape>
import { Alert, Button, Stack, TextField } from "@mui/material";
import TagSelector from "@/components/TagSelector";
import type { GenericTagType } from "@/types/EventCreator.types";

export interface EditProfileFormValues {
  first_name: string;
  last_name: string;
  bio_text: string;
}

export interface EditProfileFormProps {
  values: EditProfileFormValues;
  onChange: (patch: Partial<EditProfileFormValues>) => void;

  availableTags: GenericTagType[];
  selectedTags: GenericTagType[];
  onChangeTags: (tags: GenericTagType[]) => void;

  saving: boolean;
  isSaveDisabled: boolean;

  onSubmit: () => void;
  onCancel: () => void;
}

export default function EditProfileForm({
  values,
  onChange,
  availableTags,
  selectedTags,
  onChangeTags,
  saving,
  isSaveDisabled,
  onSubmit,
  onCancel,
}: EditProfileFormProps) {
  const firstNameValue = values.first_name.trim();
  const lastNameValue = values.last_name.trim();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      style={{ width: "100%" }}
    >
      <Stack spacing={2} sx={{ width: "100%" }}>
        <TextField
          label="First Name"
          variant="outlined"
          value={values.first_name}
          onChange={(event) => onChange({ first_name: event.target.value })}
          fullWidth
        />
        <TextField
          label="Last Name"
          variant="outlined"
          value={values.last_name}
          onChange={(event) => onChange({ last_name: event.target.value })}
          fullWidth
        />
        <TextField
          label="Bio"
          variant="outlined"
          multiline
          minRows={3}
          value={values.bio_text}
          onChange={(event) => onChange({ bio_text: event.target.value })}
          fullWidth
        />

        <TagSelector
          availableTags={availableTags}
          selectedTags={selectedTags}
          setSelectedTags={onChangeTags}
          label="Choose tags"
        />

        <Stack direction="row" spacing={2}>
          <Button
            type="button"
            variant="outlined"
            disabled={saving}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSaveDisabled}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </Stack>

        {(!firstNameValue || !lastNameValue) && (
          <Alert severity="error">First and last name are required.</Alert>
        )}
      </Stack>
    </form>
  );
}
