import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAppContext } from "./context/AppContext";

import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  const { user, loading } = useAppContext();

  if (loading) return <Loader />;

  return (
    <Router>
      {user && <Header />}

      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/signup"
          element={!user ? <SignupPage /> : <Navigate to="/dashboard" replace />}
        />

        {/* Protected route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
