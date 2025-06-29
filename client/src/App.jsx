import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import UploadFile from './components/UploadFile';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthContext.Consumer>
          {({ isAuthenticated, logout }) => (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/upload" /> : <Login />}
              />
              <Route
                path="/signup"
                element={isAuthenticated ? <Navigate to="/upload" /> : <Signup />}
              />
              <Route
                path="/upload"
                element={isAuthenticated ? <UploadFile onLogout={logout} /> : <Navigate to="/login" />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </AuthContext.Consumer>
        <Toaster position="top-right" reverseOrder={false} />
      </Router>
    </AuthProvider>
  );
}

export default App;
