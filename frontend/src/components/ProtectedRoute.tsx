import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // While checking authentication status, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
