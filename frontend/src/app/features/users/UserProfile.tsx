import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchFollowingUsersAsync,
  fetchUserAsync,
  resetAllUsers,
  selectUser,
} from "./userSlice";
import { Box, Grid, Stack, ThemeProvider, Typography } from "@mui/material";
import {
  WorkoutFeedState,
  fetchUserWorkoutsAsync,
} from "../workouts/workoutSlice";
import { globalStyles, theme } from "../../utils/Theme";
import InfiniteScroll from "react-infinite-scroll-component";
import UserCard from "./UserCard";
import Loader from "../../utils/Loader";
import FeedCard from "../workouts/FeedCard";
import AllUsersCard from "./AllUsersCard";
import FollowingUsersCard from "./FollowingUsersCard";
import { selectAccessToken } from "../sessions/sessionSlice";

const UserProfile = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.session.currentUser.id);
  const workouts = useAppSelector((state) => state.workouts.userWorkouts);
  const hasMore = useAppSelector((state) => state.workouts.hasMore);

  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);

  useEffect(() => {
    if (id && accessToken && currentUserId) {
      dispatch(fetchUserAsync({ id: id, accessToken: accessToken }));
      dispatch(
        fetchUserWorkoutsAsync({ userId: id, accessToken: accessToken })
      );
      dispatch(resetAllUsers());
      dispatch(fetchFollowingUsersAsync({ userId: id, currentUserId }));
    }
  }, [dispatch, id]);

  return (
    <ThemeProvider theme={theme}>
      {globalStyles}
      <Grid container spacing={2}>
        <Grid item xs={4} style={{ position: "relative" }}>
          <Box style={{ position: "sticky", top: "20px" }}>
            <UserCard user={user} />
            <FollowingUsersCard />
          </Box>
        </Grid>

        <Grid item xs={8}>
          <Box sx={{ p: 2 }}>
            <Stack
              direction="row"
              sx={{ gap: "20px" }}
              flexWrap="wrap"
              justifyContent="center"
            >
              {workouts?.length === 0 && (
                <Box sx={{ mt: "20px" }}>
                  <Typography variant="h4" sx={{ color: "white" }}>
                    This user has no workouts yet...
                  </Typography>
                </Box>
              )}
              {workouts &&
                workouts.length > 0 &&
                workouts.map((workout: any) => (
                  <FeedCard key={workout.id} workout={workout} user={user} />
                ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default UserProfile;
