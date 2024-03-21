import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function PrivateRoute({ children, ...rest }) {
  const {user} = useContext(AuthContext)
  let location = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: location }} />;

}

export default PrivateRoute