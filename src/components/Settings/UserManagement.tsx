import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, UserPlus, Trash2, Edit2, CheckCircle, XCircle, Key } from 'lucide-react';
import { UserForm } from './UserForm';
import type { User as UserType } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

export function UserManagement() {
  const [users, setUsers] = useLocalStorage<UserType[]>('users', []);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const { currentUser } = useAuth();

  const handleAddUser = (userData: Omit<UserType, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: UserType = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...userData
    };
    setUsers(prev => [...prev, newUser]);
    setShowForm(false);
    toast.success('Usuário criado com sucesso!');
  };

  const handleUpdateUser = (userData: Omit<UserType, 'id' | 'createdAt' | 'lastLogin'>) => {
    if (editingUser) {
      const updatedUser: UserType = {
        ...editingUser,
        ...userData
      };
      setUsers(prev => prev.map(u => u.id === editingUser.id ? updatedUser : u));
      setEditingUser(null);
      toast.success('Usuário atualizado com sucesso!');
    }
  };

  const handleUpdatePassword = async (userData: { currentPassword: string; password: string }) => {
    // Aqui você deve implementar a lógica de verificação da senha atual
    // e atualização da nova senha no backend
    try {
      // Simulando uma verificação de senha
      if (userData.currentPassword === 'senha-atual') {
        const updatedUser = {
          ...currentUser!,
          password: userData.password
        };
        setUsers(prev => prev.map(u => u.id === currentUser?.id ? updatedUser : u));
        setChangingPassword(false);
        toast.success('Senha atualizada com sucesso!');
      } else {
        toast.error('Senha atual incorreta!');
      }
    } catch (error) {
      toast.error('Erro ao atualizar senha!');
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast.success('Usuário excluído com sucesso!');
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
    toast.success('Status do usuário atualizado com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Gerenciamento de Usuários
          </h3>
        </div>
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            <UserPlus className="w-4 h-4" />
            Adicionar Usuário
          </button>
        )}
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
          <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
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
                        {currentUser?.id === user.id && (
                          <span className="ml-2 text-xs text-gray-500">(Você)</span>
                        )}
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
                    {currentUser?.id === user.id && (
                      <button
                        onClick={() => setChangingPassword(true)}
                        className="p-1 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        title="Alterar Senha"
                      >
                        <Key className="h-5 w-5" />
                      </button>
                    )}
                    {currentUser?.role === 'admin' && (
                      <>
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`p-1 rounded-full ${
                            user.isActive
                              ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                              : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                          }`}
                          title={user.isActive ? 'Desativar' : 'Ativar'}
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
                          title="Editar"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Excluir"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Nenhum usuário cadastrado
          </p>
        )}
      </div>

      {(showForm || editingUser) && (
        <UserForm
          user={editingUser || undefined}
          onSubmit={editingUser ? handleUpdateUser : handleAddUser}
          onClose={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
        />
      )}

      {changingPassword && (
        <UserForm
          user={currentUser || undefined}
          isCurrentUser={true}
          onSubmit={handleUpdatePassword}
          onClose={() => setChangingPassword(false)}
        />
      )}
    </div>
  );
}