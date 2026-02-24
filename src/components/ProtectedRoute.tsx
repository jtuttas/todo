import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';
import type { User } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  children: ReactNode;
  roles?: User['role'][];
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { isAuthenticated, isInitializing, user } = useAuth();
  if (isInitializing) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
