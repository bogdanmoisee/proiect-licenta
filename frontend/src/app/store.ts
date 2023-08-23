import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import sessionReducer from '../app/features/sessions/sessionSlice';
import exerciseReducer from '../app/features/exercises/exerciseSlice'
import workoutReducer from '../app/features/workouts/workoutSlice'
import userReducer from '../app/features/users/userSlice'



export const store = configureStore({
  reducer: {
    session: sessionReducer,
    exercises: exerciseReducer,
    workouts: workoutReducer,
    users: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

