import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TableBody,
  Table,
  Stack,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
} from "@mui/material";
import { Exercise, deleteWorkoutAsync, resetWorkout } from "./workoutSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";

function WorkoutCard(props: any) {
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleEdit = async () => {
    dispatch(resetWorkout());
    navigate(`/my-workouts/${props.workout.id}/edit`);
  };

  const handleDelete = async () => {
    if (open) {
      dispatch(deleteWorkoutAsync(props.workout.id));
      handleClose();
    } else {
      handleClickOpen();
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card
      sx={{
        width: "600px",
        margin: "1rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent>
        <Typography variant="h4" component="div">
          {props.workout.name}
        </Typography>

        <TableContainer>
          <Table sx={{ width: 600 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h5">Exercises</Typography>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {props.workout.exercises.map((exercise: Exercise) => (
                <TableRow key={exercise.id}>
                  <TableCell>
                    <Typography
                      variant="body1"
                      style={{ textTransform: "capitalize", maxWidth: "250px" }}
                    >
                      {exercise.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" style={{ marginRight: "20px" }}>
                      {exercise.sets !== 0 && exercise.reps !== 0
                        ? `${exercise.sets} sets X ${exercise.reps} reps`
                        : exercise.sets !== 0
                        ? `${exercise.sets} sets`
                        : exercise.reps !== 0
                        ? `${exercise.reps} reps`
                        : ""}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm Deletion"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this workout?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={handleDelete} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ flexGrow: 1, alignItems: "flex-end", margin: "20px" }}
      >
        <Button variant="contained" color="primary" onClick={handleEdit}>
          Edit Workout
        </Button>

        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete Workout
        </Button>
      </Stack>
    </Card>
  );
}

export default WorkoutCard;
