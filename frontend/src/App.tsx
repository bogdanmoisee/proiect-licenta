import React from 'react';
import logo from './logo.svg';
import { Counter } from './app/features/counter/Counter';
import './App.css';
import ResponsiveAppBar from './app/features/appbar/ResponsiveAppBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PersistLogin from './app/features/sessions/PersistLogin';
import PrivateRoute from './app/features/routes/PrivateRoute';
import Dashboard from './app/features/dashboard/Dashboard';
import Logout from './app/features/sessions/Logout';
import UpdateProfile from './app/features/sessions/UpdateProfile';
import PublicOnlyRoute from './app/features/routes/PublicOnlyRoute';
import Signup from './app/features/sessions/Signup';
import Login from './app/features/sessions/Login';


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
              <Route path="/" element ={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />

              <Route path='/logout' element={
                <PrivateRoute>
                  <Logout />
                </PrivateRoute>
              } />
              <Route path='/update-profile' element={
                <PrivateRoute>
                  <UpdateProfile />
                </PrivateRoute>
              } />

              <Route path='/login' element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              } />

              <Route path='/signup' element={
                <PublicOnlyRoute>
                  <Signup />
                </PublicOnlyRoute>
              } />
              
            </Route>
          </Routes>

        </main>
      </Router>

    </div>
  );
}

export default App;
