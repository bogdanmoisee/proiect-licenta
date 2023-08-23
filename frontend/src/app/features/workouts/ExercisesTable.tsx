import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ExerciseState } from "../exercises/exerciseSlice";
import { useNavigate } from "react-router-dom";
import {
  Exercise,
  fetchMyWorkoutsAsync,
  removeExercise,
  reorderExercises,
  saveExercises,
  saveWorkout,
  selectWorkout,
  setWorkoutEditable,
} from "./workoutSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { selectAccessToken } from "../sessions/sessionSlice";

const ExercisesTable = (props: any) => {
  const [exercisesData, setExercisesData] = useState<Exercise[]>([]);
  const currentUserId = useAppSelector(
    (state) => state.session?.currentUser?.id
  );
  const workout = useAppSelector(selectWorkout);
  const accessToken = useAppSelector(selectAccessToken);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleAddExercisesClick = () => {
    dispatch(
      saveExercises({
        exercises: exercisesData,
        workoutName: props.workoutName,
        isEditable: workout.is_editable,
      })
    );
    navigate("/exercises");
  };

  const handleRemoveExercise = (exerciseId: number) => {
    if (exerciseId) {
      dispatch(
        saveExercises({
          exercises: exercisesData,
          workoutName: props.workoutName,
          isEditable: workout.is_editable,
        })
      );
      dispatch(removeExercise(exerciseId));
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    if (currentUserId) {
      dispatch(
        saveExercises({
          exercises: exercisesData,
          workoutName: props.workoutName,
          isEditable: workout.is_editable,
        })
      );
      dispatch(
        saveWorkout({
          id: props.workoutId,
          name: props.workoutName,
          exercises: exercisesData,
          userId: currentUserId,
          isEditable: props.isEditable,
        })
      );
      if (accessToken) {
        dispatch(fetchMyWorkoutsAsync({ userId: currentUserId, accessToken }));
      }
    }
    navigate("/my-workouts");
  };

  useEffect(() => {
    const initialData: Exercise[] = [];

    props.exercises.forEach((exercise: Exercise) => {
      if (exercise.id !== undefined) {
        initialData.push({
          id: exercise.id,
          sets: exercise.sets || 0,
          reps: exercise.reps || 0,
        });
      }
    });

    setExercisesData(initialData);
  }, [props.exercises]);

  const handleDragStart = () => {
    dispatch(
      saveExercises({
        exercises: exercisesData,
        workoutName: props.workoutName,
        isEditable: workout.is_editable,
      })
    );
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(exercisesData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    console.log(result.source.index);
    items.splice(result.destination.index, 0, reorderedItem);

    setExercisesData(items);

    dispatch(
      reorderExercises({
        currentIndex: result.source.index,
        newIndex: result.destination.index,
      })
    );
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {props.exercises && props.exercises.length > 0 && (
        <Box
          style={{
            backgroundColor: "#242526",
            borderRadius: "10px",
            padding: "20px",
            opacity: "0.9",
          }}
          sx={{ margin: "20px" }}
        >
          <TableContainer>
            <Table sx={{ minWidth: "900px" }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "50%" }}>
                    <Typography style={{ color: "white", fontSize: "1.5em" }}>
                      Exercises
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "20%" }}>
                    <Typography
                      style={{
                        color: "white",
                        fontSize: "1.5em",
                        alignSelf: "center",
                      }}
                    >
                      Sets
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "20%" }}>
                    <Typography
                      style={{ color: "white", fontSize: "1.5em" }}
                      sx={{ alignSelf: "center" }}
                    >
                      Reps
                    </Typography>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <DragDropContext
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
              >
                <Droppable droppableId="exercises">
                  {(provided: any) => (
                    <TableBody
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {props.exercises.map(
                        (exercise: ExerciseState, index: number) => (
                          <Draggable
                            key={exercise.id.toString()}
                            draggableId={exercise.id.toString()}
                            index={index}
                          >
                            {(provided: any) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TableCell>
                                  <Typography
                                    style={{
                                      textTransform: "capitalize",
                                      color: "#1976d2",
                                      fontSize: "1.2em",
                                    }}
                                  >
                                    {exercise.name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    hiddenLabel
                                    variant="filled"
                                    value={
                                      exercisesData.find(
                                        (ex) => parseInt(ex.id) === exercise.id
                                      )?.sets || ""
                                    }
                                    onChange={(e) => {
                                      const updatedExercises =
                                        exercisesData.map((ex) =>
                                          parseInt(ex.id) === exercise.id
                                            ? {
                                                ...ex,
                                                sets: parseInt(e.target.value),
                                              }
                                            : ex
                                        );
                                      setExercisesData(updatedExercises);
                                    }}
                                    inputProps={{ style: { color: "white" } }}
                                    style={{
                                      borderRadius: "5px",
                                      width: "100%",
                                    }}
                                  >
                                    {exercise.sets}
                                  </TextField>
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    hiddenLabel
                                    variant="filled"
                                    value={
                                      exercisesData.find(
                                        (ex) => parseInt(ex.id) === exercise.id
                                      )?.reps || ""
                                    }
                                    onChange={(e) => {
                                      const updatedExercises =
                                        exercisesData.map((ex) =>
                                          parseInt(ex.id) === exercise.id
                                            ? {
                                                ...ex,
                                                reps: parseInt(e.target.value),
                                              }
                                            : ex
                                        );
                                      setExercisesData(updatedExercises);
                                    }}
                                    inputProps={{ style: { color: "white" } }}
                                    style={{
                                      borderRadius: "5px",
                                      width: "100%",
                                    }}
                                  ></TextField>
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    onClick={() =>
                                      handleRemoveExercise(exercise.id)
                                    }
                                  >
                                    <DeleteOutlineOutlinedIcon
                                      sx={{ color: "white" }}
                                    />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        )
                      )}
                      {provided.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </DragDropContext>
            </Table>
          </TableContainer>
        </Box>
      )}
      <Stack direction="row" sx={{ mt: "10px" }}>
        <Button
          variant="contained"
          onClick={handleAddExercisesClick}
          sx={{ width: "350px", margin: "10px" }}
        >
          Add Exercises
        </Button>
        <Button
          variant="contained"
          onClick={(e) => handleSave(e)}
          disabled={!(props.exercises && props.exercises.length > 0)}
          sx={{
            width: "350px",
            margin: "10px",
            color: "white",
            "&.Mui-disabled": {
              color: "white",
            },
          }}
          style={{ backgroundColor: "#242526" }}
        >
          Save {props.isEditable ? "Changes" : "Workout"}
        </Button>
      </Stack>
    </Box>
  );
};

export default ExercisesTable;
