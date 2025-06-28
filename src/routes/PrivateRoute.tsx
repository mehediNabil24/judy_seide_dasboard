// src/routes/PrivateRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

interface PrivateRouteProps {
  allowedRoles: string[];
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const token = Cookies.get("token");
  console.log("Token:", token); // Debugging line to check token
  const user = useSelector((state: any) => state.user.user);
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
