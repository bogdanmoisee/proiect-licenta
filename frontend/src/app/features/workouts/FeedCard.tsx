import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Exercise,
  addToMyWorkouts,
  deleteFromMyWorkoutsAsync,
} from "./workoutSlice";
import DoneIcon from "@mui/icons-material/Done";
import { useAppDispatch, useAppSelector } from "../../hooks";

const FeedCard = (props: any) => {
  const [isAdded, setIsAdded] = useState(false);

  const currentUserId = useAppSelector(
    (state) => state.session?.currentUser?.id
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsAdded(props.workout.is_parent);
  }, [props.workout.is_parent]);

  const handleAdd = async () => {
    if (currentUserId) {
      if (isAdded) {
        await dispatch(
          deleteFromMyWorkoutsAsync({
            userId: currentUserId,
            workoutId: props.workout.id,
          })
        );
        setIsAdded(false);
      } else {
        await dispatch(
          addToMyWorkouts({ userId: currentUserId, parentId: props.workout.id })
        );
        setIsAdded(true);
      }
    }
  };

  return (
    <Card
      sx={{
        width: "80%",
        margin: "0 0 1rem 1rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent>
        {props.user.id === currentUserId && (
          <Stack direction="row">
            <Avatar
              src={props.workout.user.avatar_url}
              sx={{ width: 64, height: 64 }}
            />
            <Typography variant="h5" component="div" sx={{ ml: 2, mt: 1 }}>
              {props.workout.user.username}
            </Typography>
          </Stack>
        )}

        <Divider light={false}>
          <Typography variant="h4" component="div">
            {props.workout.name}
          </Typography>
        </Divider>

        <TableContainer>
          <Table sx={{ width: "100%" }} aria-label="simple table">
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

        <Button
          variant={isAdded ? "outlined" : "contained"}
          color="primary"
          onClick={handleAdd}
          sx={{ mt: 2 }}
        >
          {isAdded ? (
            <Box>
              Added
              <DoneIcon sx={{ height: "15px" }} />
            </Box>
          ) : (
            "Add to my workouts"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeedCard;
