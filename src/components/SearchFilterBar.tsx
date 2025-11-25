/*
 * Author: Cam Bitter
 * Description:
 *  This component will call a callback function with arguments
 *  that show the current state of the search and sort parameters
 */

import { Box, MenuItem, TextField } from "@mui/material";

import type { GenericTagType } from "@/types/EventCreator.types";
import TagSelector from "./TagSelector";

type SortOption = {
  value: string;
  label: string;
};

type SearchFilterBarProps = {
  searchTerm: string;
  sortType: string;
  setTerm: (term: string) => void;
  setSortType: (type: string) => void;
  sortOptions: SortOption[];
  selectedTags: GenericTagType[];
  setSelectedTags: (tags: GenericTagType[]) => void;
  availableTags: GenericTagType[];
};

export default function SearchFilterBar({
  searchTerm,
  sortType,
  setTerm,
  setSortType,
  selectedTags,
  setSelectedTags,
  availableTags,
  sortOptions,
}: SearchFilterBarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          gap: 2,
        }}
      >
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(event) => setTerm(event.target.value)}
          sx={{ flex: "70%" }}
        />
        <TextField
          id="outlined-select-sort"
          select
          label="Sort"
          value={sortType}
          onChange={(event) => setSortType(event.target.value as string)}
          sx={{ flex: "30%" }}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box sx={{ width: "100%" }}>
        <TagSelector
          label="Filter by tags"
          availableTags={availableTags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </Box>
    </Box>
  );
}
