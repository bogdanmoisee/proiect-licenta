import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  getCurrentUser,
  loginWithEmailAndPassword,
  logoutUserWithToken,
  requestAccessTokenWithRefreshToken,
  updateUserProfile,
} from "../../api/sessionAPI";
import produce from "immer";
import { AppThunk, RootState } from "../../store";
import { fetchAllUsers } from "../../api/userAPI";

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
}

export interface UserLoginData {
  email: string;
  password: string;
  username?: string;
}

export interface UserUpdateData {
  currentPassword: string;
  token: string | undefined;
  email?: string;
  username?: string;
  password?: string;
  avatar_url?: string;
}

interface AuthState {
  currentUser: User;
  loading: boolean;
  error: boolean;
  errorMessages: string[];
  accessToken?: string;
  refreshToken?: string | null;
  expiresIn?: number;
  tokenType?: string;
  allUsers?: User[];
}

const initialState: AuthState = {
  currentUser: {
    id: undefined,
    email: undefined,
    username: undefined,
    role: undefined,
    createdAt: undefined,
    avatar_url: undefined,
    followers: 0,
    following: 0,
    workouts: 0,
  },
  loading: true,
  error: false,
  errorMessages: [],
  accessToken: undefined,
  refreshToken: getRefreshToken(),
  expiresIn: undefined,
  tokenType: undefined,
  allUsers: [],
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const signUpUser = createAsyncThunk(
  "session/sighUpUser",
  async (payload: UserLoginData, { rejectWithValue }) => {
    const response = await createUserWithEmailAndPassword(
      payload.email,
      payload.password,
      payload.username
    );

    if (response.errors) {
      return rejectWithValue(response.errors);
    }

    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const updateProfile = createAsyncThunk(
  "session/updateProfile",
  async (payload: UserUpdateData, { rejectWithValue }) => {
    const response = await updateUserProfile(
      payload.currentPassword,
      payload.token,
      payload?.email,
      payload?.username,
      payload?.password,
      payload?.avatar_url
    );

    if (response.errors) {
      return rejectWithValue(response.errors);
    }

    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const loginUser = createAsyncThunk(
  "session/loginUser",
  async (payload: UserLoginData, { rejectWithValue }) => {
    const loginResponse = await loginWithEmailAndPassword(
      payload.email,
      payload.password
    );

    if (loginResponse.error) {
      return rejectWithValue(loginResponse);
    }

    const userResponse = await getCurrentUser(loginResponse.access_token);
    if (userResponse.error) {
      return rejectWithValue(userResponse.data);
    }

    const response = {
      ...loginResponse,
      ...userResponse,
    };

    return response;
  }
);

export const logoutUser = createAsyncThunk(
  "session/logoutUser",
  async (payload: string, { rejectWithValue }) => {
    const response = await logoutUserWithToken(payload);

    if (response.error) {
      return rejectWithValue(response);
    }

    return response;
  }
);

export const refreshAccessToken = createAsyncThunk(
  "session/refreshAccessToken",
  async (refreshToken: string | undefined | null, { rejectWithValue }) => {
    if (!refreshToken) {
      return rejectWithValue("No refresh token");
    }

    const refreshResponse = await requestAccessTokenWithRefreshToken(
      refreshToken
    );
    if (refreshResponse.error) {
      return rejectWithValue(refreshResponse.data);
    }

    const userResponse = await getCurrentUser(refreshResponse.access_token);
    if (userResponse.error) {
      return rejectWithValue(userResponse.data);
    }

    const response = {
      ...refreshResponse,
      ...userResponse,
    };

    return response;
  }
);

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    resetErrorState: (state) => {
      state.error = false;
      state.errorMessages = [];
    },
    setFollowing: (state, action) => {
      state.currentUser.following = action.payload;
    },
    setAvatar: (state, action) => {
      state.currentUser.avatar_url = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      // SIGNUP
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.errorMessages = [];
      })
      .addCase(signUpUser.fulfilled, (state, action: any) => {
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.expiresIn = action.payload.expires_in;
        state.tokenType = action.payload.tokenType;
        state.currentUser = {
          id: action.payload.id,
          email: action.payload.email,
          username: action.payload.username,
          role: action.payload.role,
          createdAt: action.payload.created_at,
          followers: action.payload.followers,
          following: action.payload.following,
          workouts: action.payload.workouts,
        };
        storeRefreshToken(action.payload.refresh_token);

        state.loading = false;
        state.error = false;
        state.errorMessages = [];
      })
      .addCase(signUpUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = true;
        state.errorMessages = action.payload;
      })
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.errorMessages = [];
      })
      .addCase(loginUser.fulfilled, (state, action: any) => {
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.expiresIn = action.payload.expires_in;
        state.currentUser = {
          id: action.payload.id,
          email: action.payload.email,
          username: action.payload.username,
          role: action.payload.role,
          createdAt: action.payload.created_at,
          followers: action.payload.followers,
          following: action.payload.following,
          workouts: action.payload.workouts,
        };
        storeRefreshToken(action.payload.refresh_token);

        state.loading = false;
        state.error = false;
        state.errorMessages = [];
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = true;
        state.errorMessages = [
          "Invalid credentials. Did you enter them correctly?",
        ];
      })
      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.errorMessages = [];
      })
      .addCase(updateProfile.fulfilled, (state, action: any) => {
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.expiresIn = action.payload.expires_in;
        state.tokenType = action.payload.token_type;
        state.currentUser = {
          id: action.payload.id,
          email: action.payload.email,
          username: action.payload.username,
          avatar_url: action.payload.avatar_url,
          role: action.payload.role,
          createdAt: action.payload.created_at,
          followers: action.payload.followers,
          following: action.payload.following,
          workouts: action.payload.workouts,
        };
        storeRefreshToken(action.payload.refresh_token);

        state.loading = false;
        state.error = false;
        state.errorMessages = [];
      })
      .addCase(updateProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error = true;
        state.errorMessages = action.payload;
      })
      // REFRESH TOKEN
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.errorMessages = [];
      })
      .addCase(refreshAccessToken.fulfilled, (state, action: any) => {
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.expiresIn = action.payload.expires_in;
        state.currentUser = {
          id: action.payload.id,
          email: action.payload.email,
          username: action.payload.username,
          avatar_url: action.payload.avatar_url,
          role: action.payload.role,
          createdAt: action.payload.created_at,
          followers: action.payload.followers,
          following: action.payload.following,
          workouts: action.payload.workouts,
        };
        storeRefreshToken(action.payload.refresh_token);

        state.loading = false;
        state.error = false;
        state.errorMessages = [];
      })
      .addCase(refreshAccessToken.rejected, (state, action: any) => {
        state.loading = false;
        state.error = true;
      })
      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.errorMessages = [];
      })
      .addCase(logoutUser.fulfilled, (state, action: any) => {
        state.currentUser = {
          id: undefined,
          email: undefined,
          role: undefined,
          createdAt: undefined,
        };
        state.accessToken = undefined;
        state.refreshToken = undefined;
        state.expiresIn = undefined;
        state.tokenType = undefined;
        removeRefreshToken();

        state.loading = false;
        state.error = false;
        state.errorMessages = [];
      })
      .addCase(logoutUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = true;
        state.errorMessages = [action.payload.error];
      });
  },
});

export const { resetErrorState, setFollowing, setAvatar } =
  sessionSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.counter.value;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default sessionSlice.reducer;

export const selectAllUsers = (state: RootState) => state.session.allUsers;

export const selectAccessToken = (state: RootState) =>
  state.session.accessToken;

function storeRefreshToken(token: string) {
  localStorage.setItem("refreshToken", token);
}

function removeRefreshToken() {
  localStorage.removeItem("refreshToken");
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}
