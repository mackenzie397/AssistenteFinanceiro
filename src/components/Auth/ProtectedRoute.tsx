import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission } from '../../utils/security';
import { toast } from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  requireAdmin?: boolean;
  requiredPermission?: {
    resource: string;
    action: 'create' | 'read' | 'update' | 'delete';
  };
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requireAdmin,
  requiredPermission
}) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Se requireAdmin estiver definido, definir requiredRole como 'admin'
  const effectiveRequiredRole = requireAdmin ? 'admin' : requiredRole;

  useEffect(() => {
    if (!user) {
      toast.error('Você precisa estar autenticado para acessar esta página');
    } else if (effectiveRequiredRole && user.role !== effectiveRequiredRole) {
      toast.error(`Você precisa ter perfil de ${effectiveRequiredRole === 'admin' ? 'administrador' : 'usuário'} para acessar esta página`);
    } else if (
      requiredPermission && 
      !hasPermission(user, requiredPermission.resource, requiredPermission.action)
    ) {
      toast.error('Você não tem permissão para acessar esta página');
    }
  }, [user, effectiveRequiredRole, requiredPermission]);

  // Verificar se o usuário está autenticado
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar se o usuário tem o perfil necessário
  if (effectiveRequiredRole && user.role !== effectiveRequiredRole) {
    return <Navigate to="/" replace />;
  }

  // Verificar se o usuário tem a permissão necessária
  if (
    requiredPermission && 
    !hasPermission(user, requiredPermission.resource, requiredPermission.action)
  ) {
    return <Navigate to="/" replace />;
  }

  // Se passar por todas as verificações, renderizar o conteúdo
  return <>{children}</>;
};