import { Navigate, Outlet } from 'react-router-dom';

interface User {
  role: string;
  isActive: boolean;
}

interface RoleRouteProps {
  user: User;
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