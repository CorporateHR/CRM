import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionGuardProps {
  module: string;
  action: 'create' | 'read' | 'update' | 'delete';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PermissionGuard({ 
  module, 
  action, 
  children, 
  fallback = null 
}: PermissionGuardProps) {
  const { hasPermission, loading } = usePermissions();

  if (loading) return null;

  if (!hasPermission(module, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}