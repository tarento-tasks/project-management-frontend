import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../states/authState';

const ProtectedRoute = ({ allowedRoles }) => {
  const auth = useRecoilValue(authState);

  // Use localStorage as a fallback to persist authentication
  const isAuthenticated = auth?.isAuthenticated || localStorage.getItem('token');
  const userRole = auth?.role || localStorage.getItem('role');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
