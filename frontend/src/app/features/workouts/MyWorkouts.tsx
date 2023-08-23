import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  WorkoutState,
  fetchMyWorkoutsAsync,
  selectMyWorkouts,
} from "./workoutSlice";
import {
  Box,
  Pagination,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Statuses } from "../exercises/exerciseSlice";
import Loader from "../../utils/Loader";
import WorkoutCard from "./WorkoutCard";
import { globalStyles, theme } from "../../utils/Theme";
import { selectAccessToken } from "../sessions/sessionSlice";

const MyWorkouts = () => {
  const accessToken = useAppSelector(selectAccessToken);

  const workouts = useAppSelector(selectMyWorkouts);
  const currentUserId = useAppSelector(
    (state) => state.session?.currentUser?.id
  );
  const workoutStatus = useAppSelector((state) => state.workouts.status);

  const [currentPage, setCurrentPage] = useState(1);
  const [workoutsPerPage] = useState(4);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentUserId && accessToken) {
      dispatch(
        fetchMyWorkoutsAsync({
          userId: currentUserId,
          accessToken: accessToken,
        })
      );
    }
  }, [dispatch]);

  const indexOfLastWorkout = currentPage * workoutsPerPage;
  const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage;
  const currentWorkouts = workouts.slice(
    indexOfFirstWorkout,
    indexOfLastWorkout
  );

  const paginate = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);

    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  return (
    <ThemeProvider theme={theme}>
      {globalStyles}
      <Box sx={{ p: 2 }}>
        <Typography
          gutterBottom
          fontWeight={800}
          sx={{
            opacity: "0.1",
            display: "block",
            fontSize: { xs: "80px", md: "150px" },
            position: "absolute",
            left: { xs: "70px", md: "100px" },
            top: { xs: "80px", md: "48px" },
            color: "white",
          }}
        >
          My Workouts
        </Typography>

        {workoutStatus === Statuses.Loading && <Loader />}

        <Stack
          direction="row"
          sx={{ gap: "20px" }}
          flexWrap="wrap"
          justifyContent="center"
        >
          {currentWorkouts &&
            currentWorkouts.length > 0 &&
            currentWorkouts.map((workout: WorkoutState) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
        </Stack>
        <Stack sx={{ mt: { lg: "114px", xs: "70px" } }} alignItems="center">
          {workouts.length > 4 && (
            <Pagination
              color="standard"
              shape="rounded"
              defaultPage={1}
              count={Math.ceil(workouts.length / workoutsPerPage)}
              page={currentPage}
              onChange={paginate}
              size="large"
            />
          )}
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default MyWorkouts;
