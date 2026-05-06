import { Navigate, Outlet } from 'react-router-dom';
import type { AuthResponse } from '../types/perfils';

interface RoleRouteProps {
  user: AuthResponse | null;
  requiredRoles: string | string[];
  redirectPath?: string;
}

const RoleRoute = ({ user, requiredRoles }: RoleRouteProps) => {
  if (!user) return <Navigate to="/login" />;

  const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  const hasPermission = rolesArray.includes(user.role);

  return hasPermission ? <Outlet /> : <Navigate to="/home" />;
};

export default RoleRoute;