import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!user.is_staff && !user.is_superuser) {
    return (
      <div className="text-center text-red-600 text-lg mt-20">
        ❌ Access Denied: Admins Only
      </div>
    );
  }

  return children;
}
