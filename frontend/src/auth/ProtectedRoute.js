import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Chargement...</p>;

  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.some(r => user.roles.includes(r))) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
