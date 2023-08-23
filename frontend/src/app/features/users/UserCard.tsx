import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useNavigate } from "react-router-dom";
import StatsTable from "./StatsTable";
import { useEffect, useState } from "react";
import {
  followUserAsync,
  selectUser,
  setFollowers,
  unfollowUserAsync,
} from "./userSlice";
import { fetchFeedWorkoutsAsync, resetFeed } from "../workouts/workoutSlice";
import { selectAccessToken } from "../sessions/sessionSlice";

const UserCard = (props: any) => {
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);
  const currentUserId = useAppSelector((state) => state.session.currentUser.id);
  const [isFollower, setIsFollower] = useState(user?.is_followed);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setIsFollower(user?.is_followed);
  }, [user]);

  let followButton;

  const handleFollow = async () => {
    if (currentUserId && accessToken) {
      if (isFollower) {
        await dispatch(
          unfollowUserAsync({
            userId: props.user.id,
            accessToken,
          })
        );
        if (user?.followers) {
          await dispatch(setFollowers(user.followers - 1));
        }
        setIsFollower(false);
      } else {
        await dispatch(
          followUserAsync({
            userId: props.user.id,
            accessToken,
          })
        );

        if (user?.followers) {
          await dispatch(setFollowers(user.followers + 1));
        }

        await dispatch(resetFeed());

        setIsFollower(true);
      }
      await dispatch(resetFeed());
      await dispatch(
        fetchFeedWorkoutsAsync({ userId: currentUserId, start: 0 })
      );
    }
  };

  if (isFollower) {
    followButton = (
      <Button
        variant="outlined"
        color="primary"
        onClick={handleFollow}
        sx={{ m: 2 }}
      >
        Following
      </Button>
    );
  } else {
    followButton = (
      <Button
        variant="contained"
        color="primary"
        onClick={handleFollow}
        sx={{ m: 2 }}
      >
        Follow
      </Button>
    );
  }

  return (
    <Card sx={{ borderRadius: 2, m: 2, width: "100%", height: "30%" }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item md={12} lg={6}>
          <CardHeader
            avatar={
              <Avatar
                alt="User Avatar"
                src={props.user.avatar_url}
                sx={{ width: 64, height: 64 }}
              />
            }
            title={
              <Box>
                <Typography variant="h4">{props.user.username}</Typography>
                {props.user.id == currentUserId && (
                  <Typography
                    variant="body2"
                    color="primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("update-profile")}
                  >
                    Change your profile
                  </Typography>
                )}
              </Box>
            }
          />
        </Grid>
        <Grid
          item
          md={12}
          lg={6}
          sx={{
            textAlign: { md: "center", lg: "right" },
          }}
        >
          {props.user.id == currentUserId ? (
            <Button onClick={() => navigate("logout")} sx={{ m: 2 }}>
              Logout
            </Button>
          ) : (
            followButton
          )}
        </Grid>
      </Grid>

      <StatsTable user={props.user} />
    </Card>
  );
};

export default UserCard;
