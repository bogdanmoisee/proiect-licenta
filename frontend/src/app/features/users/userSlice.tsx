import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import produce from "immer";
import { RootState } from "../../store";
import {
  fetchAllUsers,
  fetchFollowingUsers,
  fetchUser,
  followUser,
  unfollowUser,
} from "../../api/userAPI";
import { Statuses } from "../exercises/exerciseSlice";

export interface User {
  id?: string;
  email?: string;
  username?: string;
  role?: string;
  createdAt?: string;
  avatar_url?: string;
  followers?: number;
  following?: number;
  workouts?: number;
  is_followed?: boolean;
}

interface UsersState {
  user?: User;
  allUsers?: User[];
  searchedUsers?: User[];
  search?: string;
  status?: Statuses;
}

const initialState: UsersState = {
  user: {},
  allUsers: [],
  searchedUsers: [],
  search: "",
  status: Statuses.Initial,
};

export const fetchAllUsersAsync = createAsyncThunk(
  "users/fetchAllUsers",
  async (userId: string) => {
    const response = await fetchAllUsers(userId);
    return response;
  }
);

export const fetchFollowingUsersAsync = createAsyncThunk(
  "users/fetchFollowingUsers",
  async (ids: { userId: string; currentUserId: string }) => {
    const response = await fetchFollowingUsers(ids.userId, ids.currentUserId);
    return response;
  }
);

export const fetchUserAsync = createAsyncThunk(
  "users/fetchUsers",
  async (user: { id: string; accessToken: string }) => {
    const response = await fetchUser(user.id, user.accessToken);
    return response;
  }
);

export const followUserAsync = createAsyncThunk(
  "users/followUser",
  async (relation: { userId: string; accessToken: string }) => {
    await followUser(relation.userId, relation.accessToken);
  }
);

export const unfollowUserAsync = createAsyncThunk(
  "users/unfollowUser",
  async (relation: { userId: string; accessToken: string }) => {
    await unfollowUser(relation.userId, relation.accessToken);
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetAllUsers: (state) => {
      state.allUsers = [];
    },
    setSearchUsers: (state, action) => {
      state.search = action.payload;
    },
    searchUsers: (state) => {
      return produce(state, (draftState) => {
        const search = draftState.search;
        const allUsers = draftState.allUsers;
        if (search && allUsers) {
          draftState.searchedUsers = allUsers.filter((user) =>
            user.username?.toLowerCase().includes(search.toLowerCase())
          );
        }
      });
    },
    setFollowers: (state, action) => {
      return produce(state, (draftState) => {
        console.log(draftState.user);
        if (draftState.user) {
          draftState.user.followers = action.payload;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL USERS
      .addCase(fetchAllUsersAsync.pending, (state) => {
        state.status = Statuses.Loading;
      })
      .addCase(fetchAllUsersAsync.fulfilled, (state, action: any) => {
        state.allUsers = action.payload;
        state.status = Statuses.UpToDate;
      })
      .addCase(fetchAllUsersAsync.rejected, (state, action: any) => {
        state.status = Statuses.Error;
      })
      // GET FOLLOWING USERS
      .addCase(fetchFollowingUsersAsync.pending, (state) => {
        state.status = Statuses.Loading;
      })
      .addCase(fetchFollowingUsersAsync.fulfilled, (state, action: any) => {
        state.allUsers = action.payload;
        state.status = Statuses.UpToDate;
      })
      .addCase(fetchFollowingUsersAsync.rejected, (state, action: any) => {
        state.status = Statuses.Error;
      })
      // GET USER
      .addCase(fetchUserAsync.pending, (state) => {
        state.status = Statuses.Loading;
      })
      .addCase(fetchUserAsync.fulfilled, (state, action: any) => {
        state.user = action.payload;
        state.status = Statuses.UpToDate;
      })
      .addCase(fetchUserAsync.rejected, (state, action: any) => {
        state.status = Statuses.Error;
      })
      // FOLLOW USER
      .addCase(followUserAsync.pending, (state) => {
        state.status = Statuses.Loading;
      })
      .addCase(followUserAsync.fulfilled, (state, action: any) => {
        state.status = Statuses.UpToDate;
      })
      .addCase(followUserAsync.rejected, (state, action: any) => {
        state.status = Statuses.Error;
      })
      // UNFOLLOW USER
      .addCase(unfollowUserAsync.pending, (state) => {
        state.status = Statuses.Loading;
      })
      .addCase(unfollowUserAsync.fulfilled, (state, action: any) => {
        state.status = Statuses.UpToDate;
      })
      .addCase(unfollowUserAsync.rejected, (state, action: any) => {
        state.status = Statuses.Error;
      });
  },
});

export const { resetAllUsers, setSearchUsers, searchUsers, setFollowers } =
  userSlice.actions;

export const selectAllUsers = (state: RootState) => state.users.allUsers;

export const selectUser = (state: RootState) => state.users.user;

export default userSlice.reducer;
