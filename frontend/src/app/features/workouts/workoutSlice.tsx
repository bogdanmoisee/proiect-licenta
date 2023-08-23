import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import produce from "immer";
import { RootState } from "../../store";
import {
  cloneWorkout,
  deleteCloneWorkout,
  deleteWorkout,
  getFeedWorkouts,
  getUserWorkouts,
  getWorkout,
  postWorkout,
  updateWorkout,
} from "../../api/workoutAPI";
import { Statuses } from "../exercises/exerciseSlice";

export interface User {
  email: string;
  avatar_url?: string;
}

export interface Exercise {
  id: string;
  name?: string;
  sets?: number;
  reps?: number;
}

export interface WorkoutState {
  id?: number;
  name?: string;
  created_at?: any;
  updated_at?: any;
  exercises: Exercise[];
  user_id: number;
  is_editable: boolean;
  is_fetched: boolean;
}

export interface WorkoutFeedState {
  id?: number;
  name?: string;
  created_at?: any;
  updated_at?: any;
  exercises: Exercise[];
  user: User;
  is_parent: boolean;
}

export interface WorkoutsState {
  workout: WorkoutState;
  myWorkouts: WorkoutState[];
  userWorkouts: WorkoutState[];
  feedWorkouts: WorkoutFeedState[];
  hasMore: boolean;
  status: string;
}

const initialState: WorkoutsState = {
  workout: {
    id: 0,
    name: "",
    created_at: "",
    updated_at: "",
    exercises: [],
    user_id: 0,
    is_editable: false,
    is_fetched: false,
  },
  myWorkouts: [],
  userWorkouts: [],
  feedWorkouts: [],
  hasMore: true,
  status: Statuses.Initial,
};

export const saveWorkout = createAsyncThunk(
  "workouts/saveWorkout",
  async (workout: {
    id: string;
    name: string;
    exercises: Exercise[];
    userId: string;
    isEditable: boolean;
  }) => {
    const exercisesData: Exercise[] = workout.exercises.map((exercise) => ({
      id: exercise.id,
      sets: exercise.sets,
      reps: exercise.reps,
    }));

    if (workout.isEditable) {
      const response = await updateWorkout(
        workout.id,
        workout.name,
        exercisesData,
        workout.userId
      );
      return response;
    } else {
      const response = await postWorkout(
        workout.name,
        exercisesData,
        workout.userId
      );
      return response;
    }
  }
);

export const addToMyWorkouts = createAsyncThunk(
  "workouts/addToMyWorkouts",
  async (workout: { userId: string; parentId: string }) => {
    const response = await cloneWorkout(workout.userId, workout.parentId);
    return response;
  }
);

export const deleteWorkoutAsync = createAsyncThunk(
  "workouts/deleteWorkout",
  async (workoutId: string) => {
    const response = await deleteWorkout(workoutId);
    return response;
  }
);

export const deleteFromMyWorkoutsAsync = createAsyncThunk(
  "workouts/deleteFromMyWorkouts",
  async (workout: { userId: string; workoutId: string }) => {
    const response = await deleteCloneWorkout(
      workout.userId,
      workout.workoutId
    );
    return response;
  }
);

export const fetchMyWorkoutsAsync = createAsyncThunk(
  "workouts/fetchMyWorkouts",
  async (user: { userId: string; accessToken: string }) => {
    const response = await getUserWorkouts(user.userId, user.accessToken);
    return response;
  }
);

export const fetchUserWorkoutsAsync = createAsyncThunk(
  "workouts/fetchUserWorkouts",
  async (user: { userId: string; accessToken: string }) => {
    const response = await getUserWorkouts(user.userId, user.accessToken);
    return response;
  }
);

export const fetchFeedWorkoutsAsync = createAsyncThunk(
  "workouts/fetchFeedWorkouts",
  async (workout: { userId: string; start: number }) => {
    const response = await getFeedWorkouts(workout.userId, workout.start);
    return response;
  }
);

export const fetchWorkoutAsync = createAsyncThunk(
  "workouts/fetchWorkout",
  async (workoutId: string) => {
    const response = await getWorkout(workoutId);
    return response;
  }
);

export const workoutSlice = createSlice({
  name: "workouts",
  initialState,
  reducers: {
    addExercise: (state, action) => {
      return produce(state, (draftState) => {
        const exercise = {
          id: action.payload.id,
          name: action.payload.name,
        };
        const item = draftState.workout.exercises.find((exercise) => {
          return exercise.id == action.payload.id;
        });
        if (!item) {
          draftState.workout.exercises = [
            ...draftState.workout.exercises,
            exercise,
          ];
        }

        draftState.status = Statuses.UpToDate;
      });
    },
    saveExercises: (state, action) => {
      return produce(state, (draftState) => {
        draftState.workout.name = action.payload.workoutName;
        draftState.workout.is_editable = action.payload.isEditable;
        action.payload.exercises.forEach((payloadExercise: Exercise) => {
          const exercise = draftState.workout.exercises.find(
            (exercise) => exercise.id === payloadExercise.id
          );
          if (exercise) {
            exercise.sets = payloadExercise.sets;
            exercise.reps = payloadExercise.reps;
          }
        });
      });
    },
    removeExercise: (state, action) => {
      return produce(state, (draftState) => {
        const index = draftState.workout.exercises.findIndex(
          (exercise) => exercise.id === action.payload
        );
        if (index !== -1) {
          draftState.workout.exercises.splice(index, 1);
        }
      });
    },
    resetWorkout: (state) => {
      return produce(state, (draftState) => {
        draftState.workout = initialState.workout;
      });
    },
    setWorkoutEditable: (state) => {
      return produce(state, (draftState) => {
        draftState.workout.is_editable = true;
      });
    },
    resetFeed: (state) => {
      return produce(state, (draftState) => {
        draftState.feedWorkouts = [];
      });
    },
    reorderExercises: (state, action) => {
      return produce(state, (draftState) => {
        const { currentIndex, newIndex } = action.payload;
        const [removed] = draftState.workout.exercises.splice(currentIndex, 1);
        draftState.workout.exercises.splice(newIndex, 0, removed);
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // POST WORKOUT
      .addCase(saveWorkout.pending, (state) => {
        state.status = Statuses.Loading;
      })
      .addCase(saveWorkout.fulfilled, (state, action: any) => {
        state.status = Statuses.UpToDate;
      })
      .addCase(saveWorkout.rejected, (state, action: any) => {
        state.status = Statuses.Error;
      })
      // ADD TO MY WORKOUTS
      .addCase(addToMyWorkouts.pending, (state) => {
        state.status = Statuses.Loading;
      })
      .addCase(addToMyWorkouts.fulfilled, (state, action: any) => {
        return produce(state, (draftState) => {
          const workoutIndex = draftState.feedWorkouts.findIndex(
            (workout) => workout.id == action.payload.id
          );

          if (workoutIndex !== -1) {
            draftState.feedWorkouts[workoutIndex].is_parent = true;
          }

          draftState.status = Statuses.UpToDate;
        });
      })
      .addCase(addToMyWorkouts.rejected, (state, action: any) => {
        state.status = Statuses.Error;
      })
      // DELETE FROM MY WORKOUTS
      .addCase(deleteFromMyWorkoutsAsync.pending, (state) => {
        state.status = Statuses.Loading;
      })
      .addCase(deleteFromMyWorkoutsAsync.fulfilled, (state, action: any) => {
        state.status = Statuses.UpToDate;
      })
      .addCase(deleteFromMyWorkoutsAsync.rejected, (state, action: any) => {
        state.status = Statuses.Error;
      })
      // DELETE WORKOUT
      .addCase(deleteWorkoutAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        });
      })
      .addCase(deleteWorkoutAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          const index = draftState.myWorkouts.findIndex(
            (workout) => workout.id === action.payload
          );
          if (index !== -1) {
            draftState.myWorkouts.splice(index, 1);
          }
          draftState.status = Statuses.UpToDate;
        });
      })
      .addCase(deleteWorkoutAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        });
      })
      // GET MY WORKOUTS
      .addCase(fetchMyWorkoutsAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        });
      })
      .addCase(fetchMyWorkoutsAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState.myWorkouts = action.payload;
          draftState.status = Statuses.UpToDate;
        });
      })
      .addCase(fetchMyWorkoutsAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        });
      })
      // GET USER WORKOUT
      .addCase(fetchUserWorkoutsAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        });
      })
      .addCase(fetchUserWorkoutsAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState.userWorkouts = action.payload;
          draftState.status = Statuses.UpToDate;
        });
      })
      .addCase(fetchUserWorkoutsAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        });
      })
      // GET FEED WORKOUTS
      .addCase(fetchFeedWorkoutsAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        });
      })
      .addCase(fetchFeedWorkoutsAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState.feedWorkouts = draftState.feedWorkouts.concat(
            action.payload
          );
          draftState.hasMore = action.payload.length >= 5;
          draftState.status = Statuses.UpToDate;
        });
      })
      .addCase(fetchFeedWorkoutsAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        });
      })
      // GET WORKOUT
      .addCase(fetchWorkoutAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        });
      })
      .addCase(fetchWorkoutAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState.workout = action.payload;
          draftState.workout.is_editable = true;
          draftState.workout.is_fetched = true;
          draftState.status = Statuses.UpToDate;
        });
      })
      .addCase(fetchWorkoutAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        });
      });
  },
});

export const {
  addExercise,
  saveExercises,
  removeExercise,
  resetWorkout,
  setWorkoutEditable,
  resetFeed,
  reorderExercises,
} = workoutSlice.actions;

export const selectWorkout = (state: RootState) => state.workouts.workout;

export const selectMyWorkouts = (state: RootState) => state.workouts.myWorkouts;

export const selectFeedWorkouts = (state: RootState) =>
  state.workouts.feedWorkouts;

export const selectStatus = (state: RootState) => state.workouts.status;

export default workoutSlice.reducer;
