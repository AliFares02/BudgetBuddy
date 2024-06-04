import { Navigate, Route } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

function PrivateRoute({ element, ...rest }) {
  const {user} = useAuthContext()

  return user ? <Route {...rest} element={element} /> : <Navigate to="/login" />;

}

export default PrivateRoute