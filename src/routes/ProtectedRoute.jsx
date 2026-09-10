import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ requiredRole }) => {
  const localToken = localStorage.getItem("ht_token");
  let { token, role } = useSelector((state) => state.auth);
  if (localToken) {
    token = localToken;
  }
  debugger;
  if (!token) return <Navigate to="/login" replace />;
    if (requiredRole && role !== requiredRole && role !== "ADMIN") {
      return <Navigate to="/unauthorized" replace />;
    }
  return <Outlet />;
};
