import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

const ProtectedRoute = ({ children, withLayout = true }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/" replace />;
  
  return withLayout ? <Layout>{children}</Layout> : children;
};

export default ProtectedRoute;
