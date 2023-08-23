import {
  Avatar,
  Box,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonAddDisabledIcon from "@mui/icons-material/PersonAddDisabled";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchFollowingUsersAsync,
  followUserAsync,
  resetAllUsers,
  unfollowUserAsync,
} from "./userSlice";
import { selectAccessToken, setFollowing } from "../sessions/sessionSlice";
import { fetchFeedWorkoutsAsync, resetFeed } from "../workouts/workoutSlice";
import { Link, useParams } from "react-router-dom";

const UserItemList = (props: any) => {
  const [isFollower, setIsFollower] = useState(props.user.is_followed);
  const currentUserId = useAppSelector(
    (state) => state.session?.currentUser?.id
  );
  const following = useAppSelector(
    (state) => state.session.currentUser.following
  );
  const accessToken = useAppSelector(selectAccessToken);
  const dispatch = useAppDispatch();

  const handleFollow = async () => {
    if (currentUserId && accessToken) {
      if (isFollower) {
        await dispatch(
          unfollowUserAsync({
            userId: props.user.id,
            accessToken,
          })
        );
        if (following) {
          await dispatch(setFollowing(following - 1));
        }
        setIsFollower(false);
      } else {
        await dispatch(
          followUserAsync({
            userId: props.user.id,
            accessToken,
          })
        );
        if (following) {
          await dispatch(setFollowing(following + 1));
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

  return (
    <ListItem key={props.user.id} disableGutters>
      <ListItemAvatar>
        <Avatar src={props.user?.avatar_url} sx={{ width: 48, height: 48 }} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Link to={`/profile/${props.user.id}`}>
            <Typography variant="body1" color="textSecondary">
              {props.user.username}
            </Typography>
          </Link>
        }
      />

      <Box sx={{ ml: "auto" }}>
        {isFollower ? (
          <Button variant="outlined" color="primary" onClick={handleFollow}>
            Following
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleFollow}>
            Follow
          </Button>
        )}
      </Box>
    </ListItem>
  );
};

export default UserItemList;
