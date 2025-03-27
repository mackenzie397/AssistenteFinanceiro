import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Se o usuário estiver autenticado, redirecionar para a página principal
  if (isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Se não estiver autenticado, renderizar o conteúdo
  return <>{children}</>;
}; 