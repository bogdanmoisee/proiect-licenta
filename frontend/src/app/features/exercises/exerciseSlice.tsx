import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import produce from "immer";
import { RootState } from "../../store";
import { fetchExercises } from "../../api/exerciseAPI";
import BodyPart from "./BodyPart";

export enum Statuses {
  Initial = "Not Fetched",
  Loading = "Loading...",
  UpToDate = "Up To Date",
  NotFound = "No results",
  Deleted = "Deleted",
  Error = "Error",
}

export interface ExerciseState {
  id: number;
  name?: string;
  description?: string;
  sets?: number;
  reps?: number;
  created_at?: any;
  updated_at?: any;
  body_part?: string;
  equipment?: string;
  gif_url?: string;
  target?: string;
}

export interface ExercisesState {
  exercises: ExerciseState[];
  filteredExercises: ExerciseState[];
  status: string;
  bodyPart: string;
  search: string | undefined;
}

const initialState: ExercisesState = {
  exercises: [
    {
      id: 0,
      name: "",
      description: "",
      sets: 0,
      reps: 0,
      created_at: "",
      updated_at: "",
      body_part: "",
      equipment: "",
      gif_url: "",
      target: "",
    },
  ],
  filteredExercises: [],
  status: Statuses.Initial,
  bodyPart: "all",
  search: undefined,
};

export const fetchExercisesAsync = createAsyncThunk(
  "exercises/fetchExercises",
  async () => {
    const response = await fetchExercises();
    return response;
  }
);

export const exerciseSlice = createSlice({
  name: "exercises",
  initialState,
  reducers: {
    searchExercises: (state, action) => {
      return produce(state, (draftState) => {
        const search = draftState.search;
        const bodyPart = draftState.bodyPart;

        if (search) {
          draftState.filteredExercises = draftState.exercises.filter(
            (exercise: ExerciseState) =>
              exercise.name?.toLowerCase().includes(search) ||
              exercise.body_part?.toLowerCase().includes(search) ||
              exercise.target?.toLowerCase().includes(search) ||
              exercise.equipment?.toLowerCase().includes(search)
          );
        } else {
          draftState.filteredExercises = draftState.exercises;
        }

        if (bodyPart && bodyPart != "all") {
          draftState.filteredExercises = draftState.filteredExercises.filter(
            (exercise: ExerciseState) =>
              exercise.body_part?.toLowerCase().includes(bodyPart)
          );
        }

        if (draftState.filteredExercises.length == 0) {
          draftState.status = Statuses.NotFound;
        } else {
          draftState.status = Statuses.UpToDate;
        }
      });
    },
    changeSearch: (state, action) => {
      return produce(state, (draftState) => {
        draftState.search = action.payload;
      });
    },
    changeBodyPart: (state, action) => {
      return produce(state, (draftState) => {
        const bodyPart = action.payload;
        draftState.bodyPart = bodyPart;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercisesAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        });
      })
      .addCase(fetchExercisesAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState.exercises = action.payload;
          draftState.status = Statuses.UpToDate;
        });
      })
      .addCase(fetchExercisesAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        });
      });
  },
});

export const { searchExercises, changeBodyPart, changeSearch } =
  exerciseSlice.actions;

export const selectExercises = (state: RootState) => state.exercises.exercises;

export const selectStatus = (state: RootState) => state.exercises.status;

export default exerciseSlice.reducer;
