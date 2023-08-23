import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks";
import {
  fetchExercisesAsync,
  searchExercises,
  changeSearch,
} from "./exerciseSlice";
import { Box, Stack, TextField } from "@mui/material";

const SearchExercises = (props: any) => {
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dispatch(fetchExercisesAsync());
  }, [dispatch]);

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      props.setCurrentPage(1);
      dispatch(changeSearch(search));
      dispatch(searchExercises({}));
    }, 1000); // 1 second delay

    setTimeoutId(newTimeoutId);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [search, dispatch]);

  return (
    <Box sx={{ zIndex: 3, position: "relative" }}>
      <Stack alignItems="center" mt="37px" justifyContent="center" p="20px">
        <Box position="relative" mb="5px" width="100%">
          <TextField
            sx={{
              input: { fontWeight: "700", border: "none", borderRadius: "4px" },
              width: "100%",
              borderRadius: "4px",
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            label="Search Exercises"
            type="text"
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default SearchExercises;
