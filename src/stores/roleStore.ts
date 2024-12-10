import { create } from 'zustand';
import { Role, Permission } from '../types/role';

interface RoleStore {
  roles: Role[];
  permissions: Permission[];
  loading: boolean;
  fetchRoles: () => void;
  fetchPermissions: () => void;
  createRole: (roleData: { name: string; description: string; permissions: Permission[] }) => void;
  updateRole: (roleId: string, roleData: { name: string; description: string; permissions: Permission[] }) => void;
  deleteRole: (roleId: string) => void;
}

const mockPermissions: Permission[] = [
  { 
    id: '1', 
    name: 'View Dashboard', 
    description: 'Can view the dashboard',
    module: 'dashboard',
    actions: ['read']
  },
  { 
    id: '2', 
    name: 'Manage Leads', 
    description: 'Can create, edit, and delete leads',
    module: 'leads',
    actions: ['create', 'read', 'update', 'delete']
  },
  { 
    id: '3', 
    name: 'Manage Users', 
    description: 'Can manage user accounts and roles',
    module: 'users',
    actions: ['create', 'read', 'update', 'delete']
  },
  { 
    id: '4', 
    name: 'View Reports', 
    description: 'Can view and generate reports',
    module: 'reports',
    actions: ['read']
  }
];

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access',
    permissions: mockPermissions,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sales Manager',
    description: 'Manage sales team and leads',
    permissions: [
      mockPermissions[0],
      mockPermissions[1]
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Sales Representative',
    description: 'Basic sales operations',
    permissions: [
      mockPermissions[0],
      mockPermissions[1]
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useRoleStore = create<RoleStore>((set) => ({
  roles: mockRoles,
  permissions: mockPermissions,
  loading: false,
  
  fetchRoles: () => {
    set({ roles: mockRoles, loading: false });
  },
  
  fetchPermissions: () => {
    set({ permissions: mockPermissions, loading: false });
  },
  
  createRole: (roleData) => {
    const newRole: Role = {
      id: `role_${Date.now()}`,
      ...roleData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    set((state) => ({ 
      roles: [...state.roles, newRole],
      loading: false 
    }));
  },
  
  updateRole: (roleId, roleData) => {
    set((state) => ({
      roles: state.roles.map(role => 
        role.id === roleId 
          ? { 
              ...role, 
              ...roleData, 
              updated_at: new Date().toISOString() 
            } 
          : role
      ),
      loading: false
    }));
  },
  
  deleteRole: (roleId) => {
    set((state) => ({
      roles: state.roles.filter(role => role.id !== roleId),
      loading: false
    }));
  }
}));
