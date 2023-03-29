import React from 'react';
import logo from './logo.svg';
import { Counter } from './app/features/counter/Counter';
import './App.css';
import ResponsiveAppBar from './app/features/appbar/ResponsiveAppBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PersistLogin from './app/features/sessions/PersistLogin';
import PrivateRoute from './app/features/routes/PrivateRoute';
import Dashboard from './app/features/dashboard/Dashboard';


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
            </Route>
          </Routes>

        </main>
      </Router>

    </div>
  );
}

export default App;
