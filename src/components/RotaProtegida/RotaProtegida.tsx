import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const RotaProtegida = () => {
  const auth = useContext(AuthContext);

  if (auth.token === null) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RotaProtegida;