/*
 * Author: Cam Bitter
 * Description:
 *  This component will call a callback function with arguments
 *  that show the current state of the search and sort parameters
 */

import { Box, MenuItem, TextField } from "@mui/material";
import type { SortType } from "@/types/Sort.types";

type SearchFilterBarProps = {
  searchTerm: string;
  sortType: SortType;
  setTerm: (term: string) => void;
  setSortType: (type: SortType) => void;
};

export default function SearchFilterBar({
  searchTerm,
  sortType,
  setTerm,
  setSortType,
}: SearchFilterBarProps) {
  const sortOptions = [
    {
      value: "newest",
      label: "Newest",
    },
    {
      value: "oldest",
      label: "Oldest",
    },
    {
      value: "alphabetical",
      label: "Alphabetical",
    },
    {
      value: "none",
      label: "None",
    },
  ];

  return (
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
        sx={{ flex: "80%" }}
      />
      <TextField
        id="outlined-select-sort"
        select
        label="Sort"
        value={sortType}
        onChange={(event) => setSortType(event.target.value as SortType)}
        sx={{ flex: "20%" }}
      >
        {sortOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
