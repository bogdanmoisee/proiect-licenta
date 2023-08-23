import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  Box,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import ExercisesTable from "./ExercisesTable";
import {
  WorkoutState,
  fetchMyWorkoutsAsync,
  fetchWorkoutAsync,
  selectWorkout,
  setWorkoutEditable,
} from "./workoutSlice";
import { AppDispatch } from "../../store";
import { Statuses } from "../exercises/exerciseSlice";
import Loader from "../../utils/Loader";
import { globalStyles, theme } from "../../utils/Theme";

const EditWorkout = () => {
  const { workoutId } = useParams();
  const workout = useAppSelector(selectWorkout);
  const [workoutName, setWorkoutName] = useState<string | undefined>("");
  const workoutStatus = useAppSelector((state) => state.workouts.status);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (workout.name) {
      setWorkoutName(workout.name);
    }
  }, [workout]);

  useEffect(() => {
    dispatch(setWorkoutEditable());
    if (workoutId && !workout.is_fetched) {
      dispatch(fetchWorkoutAsync(workoutId)).then((action) => {
        if (fetchWorkoutAsync.fulfilled.match(action)) {
          setWorkoutName(action.payload.name);
        }
      });
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      {globalStyles}
      <div>
        <form>
          <Stack direction="column" alignItems="center">
            <Typography
              fontWeight={800}
              sx={{
                opacity: "0.1",
                display: "block",
                fontSize: "150px",
                position: "absolute",
                left: "100px",
                top: "48px",
                color: "white",
              }}
            >
              Edit workout
            </Typography>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <TextField
                variant="outlined"
                label="Workout Name"
                value={workoutName}
                onChange={(event) => setWorkoutName(event.target.value)}
                sx={{
                  margin: "60px 20px 30px 20px",
                  width: "500px",
                  position: "relative",
                }}
              />
              {workoutStatus === Statuses.Loading && <Loader />}

              {workout !== null && (
                <ExercisesTable
                  exercises={workout.exercises}
                  workoutName={workoutName}
                  workoutId={workout.id}
                  isEditable={true}
                />
              )}
            </Box>
          </Stack>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default EditWorkout;
