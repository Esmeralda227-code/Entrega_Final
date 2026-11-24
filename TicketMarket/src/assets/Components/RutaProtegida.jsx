
import { Navigate, Outlet } from 'react-router';
import { useSesion } from '../Context/SesionContext.jsx';

function RutaProtegida({ rolesPermitidos }) {
  const { sesion } = useSesion();

  if (!sesion) {
    return <Navigate to="/" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(sesion.rol)) {
    return <Navigate to="/eventos" replace />;
  }

  return <Outlet />;
}

export default RutaProtegida;
