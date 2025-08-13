// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { type JSX } from "react";
export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  if (!user) {
    // If not logged in, force them to the Login page
    return <Navigate to="/login" />;
  }

  // If logged in, show the secret page
  return children;
}