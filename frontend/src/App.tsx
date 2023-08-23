import React from "react";
import logo from "./logo.svg";
import "./App.css";
import ResponsiveAppBar from "./app/features/appbar/ResponsiveAppBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PersistLogin from "./app/features/sessions/PersistLogin";
import PrivateRoute from "./app/features/routes/PrivateRoute";
import Logout from "./app/features/sessions/Logout";
import UpdateProfile from "./app/features/sessions/UpdateProfile";
import PublicOnlyRoute from "./app/features/routes/PublicOnlyRoute";
import Signup from "./app/features/sessions/Signup";
import Login from "./app/features/sessions/Login";
import Exercises from "./app/features/exercises/Exercises";
import CreateWorkout from "./app/features/workouts/CreateWorkout";
import MyWorkouts from "./app/features/workouts/MyWorkouts";
import EditWorkout from "./app/features/workouts/EditWorkout";
import Feed from "./app/features/workouts/Feed";
import UserProfile from "./app/features/users/UserProfile";

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <ResponsiveAppBar />
        </header>

        <main>
          <Routes>
            <Route element={<PersistLogin />}>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Feed />
                  </PrivateRoute>
                }
              />

              <Route
                path="/logout"
                element={
                  <PrivateRoute>
                    <Logout />
                  </PrivateRoute>
                }
              />
              <Route
                path="/update-profile"
                element={
                  <PrivateRoute>
                    <UpdateProfile />
                  </PrivateRoute>
                }
              />

              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <Login />
                  </PublicOnlyRoute>
                }
              />

              <Route
                path="/signup"
                element={
                  <PublicOnlyRoute>
                    <Signup />
                  </PublicOnlyRoute>
                }
              />

              <Route
                path="/exercises"
                element={
                  <PrivateRoute>
                    <Exercises />
                  </PrivateRoute>
                }
              />

              <Route
                path="/create-workout"
                element={
                  <PrivateRoute>
                    <CreateWorkout />
                  </PrivateRoute>
                }
              />

              <Route
                path="/my-workouts"
                element={
                  <PrivateRoute>
                    <MyWorkouts />
                  </PrivateRoute>
                }
              />

              <Route
                path="/my-workouts/:workoutId/edit"
                element={
                  <PrivateRoute>
                    <EditWorkout />
                  </PrivateRoute>
                }
              />

              <Route
                path="/profile/:id"
                element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
