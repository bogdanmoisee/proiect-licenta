import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  WorkoutFeedState,
  fetchFeedWorkoutsAsync,
  resetFeed,
  selectFeedWorkouts,
} from "./workoutSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  IconButton,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import FeedCard from "./FeedCard";
import Loader from "../../utils/Loader";
import UserCard from "../users/UserCard";
import InfiniteScroll from "react-infinite-scroll-component";
import AllUsersCard from "../users/AllUsersCard";
import { globalStyles, theme } from "../../utils/Theme";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";

const Feed = () => {
  const currentUser = useAppSelector((state) => state.session?.currentUser);
  const hasMore = useAppSelector((state) => state.workouts.hasMore);
  const workouts = useAppSelector(selectFeedWorkouts);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(resetFeed());
    if (currentUser.id) {
      dispatch(fetchFeedWorkoutsAsync({ userId: currentUser.id, start: 0 }));
    }
  }, [dispatch]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const fetchData = () => {
    if (currentUser.id) {
      dispatch(
        fetchFeedWorkoutsAsync({
          userId: currentUser.id,
          start: workouts.length,
        })
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {globalStyles}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} style={{ position: "relative" }}>
          <Box
            sx={{ display: { xs: "none", md: "block" } }}
            style={{ position: "sticky", top: "20px" }}
          >
            <UserCard user={currentUser} />
            <AllUsersCard />
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ p: 2 }}>
            <InfiniteScroll
              dataLength={workouts.length}
              next={fetchData}
              hasMore={hasMore}
              loader={<Loader />}
            >
              <Stack
                direction="row"
                sx={{ gap: "20px" }}
                flexWrap="wrap"
                justifyContent="center"
              >
                {workouts &&
                  workouts.length > 0 &&
                  workouts.map((workout: WorkoutFeedState) => (
                    <FeedCard
                      key={workout.id}
                      workout={workout}
                      user={currentUser}
                    />
                  ))}
              </Stack>
            </InfiniteScroll>
          </Box>
        </Grid>
        <Box sx={{ position: "fixed", right: 50, bottom: 20, zIndex: 999 }}>
          {isScrolled && (
            <ArrowUpwardRoundedIcon
              onClick={scrollToTop}
              sx={{ color: "white", width: 50, height: 50, cursor: "pointer" }}
            />
          )}
        </Box>
      </Grid>
    </ThemeProvider>
  );
};

export default Feed;
