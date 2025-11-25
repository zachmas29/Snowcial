import { Autocomplete, TextField } from "@mui/material";
import type { GenericTagType } from "@/types/EventCreator.types";

interface TagSelectorProps {
  availableTags: GenericTagType[];
  selectedTags: GenericTagType[];
  setSelectedTags: (tags: GenericTagType[]) => void;
  label: string;
}

export default function TagSelector({
  availableTags,
  selectedTags,
  setSelectedTags,
  label,
}: TagSelectorProps) {
  return (
    <div>
      <Autocomplete
        multiple
        id="tags-standard"
        options={availableTags}
        getOptionLabel={(tag) => tag.name}
        value={selectedTags}
        onChange={(_event, newValue) => setSelectedTags(newValue)}
        isOptionEqualToValue={(option, value) => option.id === value.id} // prevents duplicates
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={label}
            placeholder="Tags"
          />
        )}
      />
    </div>
  );
}
