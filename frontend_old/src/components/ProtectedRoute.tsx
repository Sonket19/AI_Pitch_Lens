import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAppContext();

  // Show loader while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-700 text-lg">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600"></div>
          <p>Authenticating...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise render the protected page
  return <>{children}</>;
};

export default ProtectedRoute;