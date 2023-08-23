import {
  Box,
  Button,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { saveWorkout, selectStatus, selectWorkout } from "./workoutSlice";
import ExercisesTable from "./ExercisesTable";
import { globalStyles, theme } from "../../utils/Theme";

const CreateWorkout = () => {
  const [workoutName, setWorkoutName] = useState("");

  const workout = useAppSelector(selectWorkout);

  useEffect(() => {
    if (workout.name) {
      setWorkoutName(workout.name);
    }
  }, [workout]);

  return (
    <ThemeProvider theme={theme}>
      {globalStyles}
      <Box>
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
              Create your workout
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
              <ExercisesTable
                exercises={workout.exercises}
                workoutName={workoutName}
              />
            </Box>
          </Stack>
        </form>
      </Box>
    </ThemeProvider>
  );
};

export default CreateWorkout;
