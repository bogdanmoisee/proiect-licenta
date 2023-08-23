import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  Statuses,
  fetchExercisesAsync,
  selectExercises,
  selectStatus,
} from "./exerciseSlice";
import Exercise from "./Exercise";
import SearchExercises from "./SearchExercises";
import HorizontalScrollbar from "./HorizontalScrollbar";
import {
  Box,
  Pagination,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Loader from "../../utils/Loader";
import { globalStyles, theme } from "../../utils/Theme";

const Exercises = () => {
  const exercises = useAppSelector(selectExercises);
  const filteredExercises = useAppSelector(
    (state) => state.exercises.filteredExercises
  );
  const status = useAppSelector(selectStatus);
  const dispatch = useAppDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [exercisesPerPage] = useState(8);

  useEffect(() => {
    dispatch(fetchExercisesAsync());
  }, [dispatch]);

  let contents;
  const displayExercises =
    filteredExercises.length > 0 ? filteredExercises : exercises;

  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = displayExercises.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );

  const paginate = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);

    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  if (!currentExercises.length) return <Loader />;

  if (status === Statuses.NotFound) {
    contents = <></>;
  } else if (status !== Statuses.UpToDate) {
    console.log(status);
    contents = <Loader />;
  } else {
    contents = (
      <div className="card">
        <Stack
          direction="row"
          sx={{ gap: { lg: "107px", xs: "50px" } }}
          flexWrap="wrap"
          justifyContent="center"
        >
          {currentExercises.map((exercise) => (
            <Exercise key={exercise.id} exercise={exercise} />
          ))}
        </Stack>
        <Stack sx={{ mt: { lg: "114px", xs: "70px" } }} alignItems="center">
          {displayExercises.length > 9 && (
            <Pagination
              color="standard"
              shape="rounded"
              defaultPage={1}
              count={Math.ceil(displayExercises.length / exercisesPerPage)}
              page={currentPage}
              onChange={paginate}
              size="large"
            />
          )}
        </Stack>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      {globalStyles}
      <Box>
        <Typography
          fontWeight={400}
          sx={{
            opacity: "0.1",
            display: "block",
            fontSize: "300px",
            zIndex: 1,
            position: "absolute",
            left: "20px",
            top: "-25px",
            pointerEvents: "none",
            color: "white",
          }}
        >
          Exercises
        </Typography>
        <SearchExercises setCurrentPage={setCurrentPage} />
        <HorizontalScrollbar setCurrentPage={setCurrentPage} />
        <Box id="exercises" sx={{ mt: { lg: "20px" } }} mt="5px" p="20px">
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontSize: { lg: "44px", xs: "30px" },
              color: "white",
              opacity: 0.5,
            }}
            mb="40px"
          >
            {status === Statuses.NotFound
              ? Statuses.NotFound
              : "Showing Results"}
          </Typography>
          {contents}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Exercises;
