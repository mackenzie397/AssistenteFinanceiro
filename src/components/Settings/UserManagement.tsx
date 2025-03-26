import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, UserPlus, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';
import type { User as UserType } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function UserManagement() {
  const [users, setUsers] = useLocalStorage<UserType[]>('users', []);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  const handleAddUser = (user: Omit<UserType, 'id' | 'createdAt'>) => {
    const newUser: UserType = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isActive: true,
      ...user,
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = (user: UserType) => {
    setUsers(prev => prev.map(u => u.id === user.id ? user : u));
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Gerenciamento de Usuários
        </h3>
        <button
          onClick={() => setEditingUser({
            id: '',
            name: '',
            email: '',
            role: 'client',
            createdAt: '',
            isActive: true,
          } as UserType)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          <UserPlus className="w-4 h-4" />
          Novo Usuário
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Função
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Último Acesso
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.avatar ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar}
                          alt={user.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {user.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleToggleUserStatus(user.id)}
                      className={`p-1 rounded-full ${
                        user.isActive
                          ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                          : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                      }`}
                    >
                      {user.isActive ? (
                        <XCircle className="h-5 w-5" />
                      ) : (
                        <CheckCircle className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingUser(user)}
                      className="p-1 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}