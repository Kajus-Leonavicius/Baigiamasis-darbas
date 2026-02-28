import { Navigate, Outlet } from "react-router-dom"

const PrivateRoute = () => {
    const user = localStorage.getItem("access_token")
    return user ? <Outlet /> : <Navigate to="/Login" replace />;
  };
export default PrivateRoute;