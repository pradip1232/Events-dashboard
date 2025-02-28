import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const isLoggedIn = localStorage.getItem("user_logged_in") === "true";
    console.log("Checking login state:", isLoggedIn);

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
