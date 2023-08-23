import { Box, Button, Stack, Typography } from "@mui/material";
import { ExerciseState } from "./exerciseSlice";
import { addExercise, selectWorkout } from "../workouts/workoutSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";

const Exercise = (props: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const workout = useAppSelector(selectWorkout);

  const handleAddExercise = (exercise: ExerciseState) => {
    dispatch(addExercise(exercise));
    if (workout.is_editable) {
      navigate(`/my-workouts/${workout.id}/edit`);
    } else {
      navigate("/create-workout");
    }
  };

  return (
    <div className="exercise-card">
      <div>
        <img
          src={props.exercise.gif_url}
          alt={props.exercise.name}
          loading="lazy"
        />
        <Stack direction="row" mt={2}>
          <Button
            sx={{
              ml: "21px",
              color: "#fff",
              background: "#FF2625",
              fontSize: "14px",
              borderRadius: "20px",
              textTransform: "capitalize",
            }}
          >
            {props.exercise.body_part}
          </Button>
          <Button
            sx={{
              ml: "21px",
              color: "#fff",
              background: "#1976d2",
              fontSize: "14px",
              borderRadius: "20px",
              textTransform: "capitalize",
            }}
          >
            {props.exercise.target}
          </Button>
        </Stack>
        <Box mt={1} style={{ padding: "10px" }}>
          <Typography
            ml="21px"
            color="#fff"
            fontWeight="bold"
            sx={{ fontSize: { lg: "24px", xs: "20px" } }}
            mt="11px"
            textTransform="capitalize"
          >
            {props.exercise.name}
          </Typography>
        </Box>
      </div>
      <div style={{ width: "100%" }}>
        <Button
          variant="contained"
          onClick={() => handleAddExercise(props.exercise)}
          sx={{ borderRadius: "0 0 30px 30px", width: "100%" }}
        >
          Add Exercise
        </Button>
      </div>
    </div>
  );
};

export default Exercise;
