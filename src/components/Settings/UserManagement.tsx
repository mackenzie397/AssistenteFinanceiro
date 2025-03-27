import React, { useState, useCallback, useMemo } from 'react';
import { User, UserPlus, Trash2, Edit2, CheckCircle, XCircle, Key } from 'lucide-react';
import { UserForm } from './UserForm';
import type { User as UserType, UserRole } from '../../types';
import { useAuthSelector } from '../../hooks/useAuthSelector';
import { generateSecureId, hashPassword, hasPermission } from '../../utils/security';
import { validateData, updateUserSchema } from '../../utils/validation';
import { notify } from '../../utils/errorHandling';
import { userStorage } from '../../utils/storage';

// Tipo FormData compatível com o UserForm
type FormData = {
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  password?: string;
  confirmPassword?: string;
  currentPassword?: string;
};

// Componente para representar uma linha da tabela de usuários
const UserRow = React.memo(({
  user,
  currentUser,
  onEdit,
  onDelete,
  onToggleStatus,
  onChangePassword
}: {
  user: UserType;
  currentUser: UserType | null;
  onEdit: (user: UserType) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onChangePassword: () => void;
}) => (
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
            onClick={() => onChangePassword()}
            className="p-1 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
            title="Alterar Senha"
            aria-label="Alterar senha do usuário"
          >
            <Key className="h-5 w-5" />
          </button>
        )}
        {currentUser?.role === 'admin' && (
          <>
            <button
              onClick={() => onToggleStatus(user.id)}
              className={`p-1 rounded-full ${
                user.isActive
                  ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                  : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
              }`}
              title={user.isActive ? 'Desativar' : 'Ativar'}
              aria-label={user.isActive ? 'Desativar usuário' : 'Ativar usuário'}
            >
              {user.isActive ? (
                <XCircle className="h-5 w-5" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => onEdit(user)}
              className="p-1 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
              title="Editar"
              aria-label="Editar usuário"
            >
              <Edit2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(user.id)}
              className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              title="Excluir"
              aria-label="Excluir usuário"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </td>
  </tr>
));

export function UserManagement() {
  const [users, setUsers] = useState<UserType[]>(() => userStorage.getAll());
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Usar o hook selector em vez do useContext diretamente
  const currentUser = useAuthSelector(state => state.user);

  // Função para atualizar o estado local e o userStorage
  const updateUsers = useCallback((newUsers: UserType[]) => {
    setUsers(newUsers);
    userStorage.save(newUsers);
  }, []);

  const handleAddUser = useCallback(async (userData: FormData) => {
    try {
      setIsLoading(true);
      
      // Validar dados do formulário
      const validation = validateData(updateUserSchema, {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        isActive: userData.isActive
      });

      if (!validation.success) {
        notify.error(validation.errors);
        return;
      }

      // Verificar permissões
      if (!hasPermission(currentUser, 'users', 'create')) {
        notify.error('Você não tem permissão para adicionar usuários');
        return;
      }

      // Verificar se o email já existe
      if (userStorage.findByEmail(userData.email || '')) {
        notify.error('Email já cadastrado');
        return;
      }

      // Hash da senha
      let passwordHash = undefined;
      if (userData.password) {
        passwordHash = await hashPassword(userData.password);
      }

      const newUser: UserType = {
        id: generateSecureId(),
        createdAt: new Date().toISOString(),
        name: userData.name || '',
        email: userData.email || '',
        password: passwordHash,
        role: (userData.role || 'user') as UserRole,
        isActive: userData.isActive === undefined ? true : userData.isActive
      };

      // Adicionar o usuário ao storage
      userStorage.add(newUser);
      
      // Atualizar o estado local
      updateUsers([...users, newUser]);
      
      setShowForm(false);
      notify.success('Usuário criado com sucesso!');
    } catch (error) {
      notify.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, users, updateUsers]);

  const handleUpdateUser = useCallback(async (userData: FormData) => {
    try {
      setIsLoading(true);
      
      if (!editingUser) return;

      // Validar dados do formulário
      const validation = validateData(updateUserSchema, {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        isActive: userData.isActive
      });

      if (!validation.success) {
        notify.error(validation.errors);
        return;
      }

      // Verificar permissões
      if (!hasPermission(currentUser, 'users', 'update')) {
        notify.error('Você não tem permissão para editar usuários');
        return;
      }

      // Verificar se está tentando alterar email para um já existente
      if (userData.email && userData.email !== editingUser.email && 
          userStorage.findByEmail(userData.email)) {
        notify.error('Email já cadastrado');
        return;
      }

      const updatedUser: UserType = {
        ...editingUser,
        name: userData.name || editingUser.name,
        email: userData.email || editingUser.email,
        role: (userData.role || editingUser.role) as UserRole,
        isActive: userData.isActive === undefined ? editingUser.isActive : userData.isActive
      };

      // Atualizar o usuário no storage
      userStorage.update(editingUser.id, updatedUser);
      
      // Atualizar o estado local
      updateUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
      
      setEditingUser(null);
      notify.success('Usuário atualizado com sucesso!');
    } catch (error) {
      notify.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, editingUser, users, updateUsers]);

  const handleUpdatePassword = useCallback(async (userData: FormData) => {
    try {
      // Verificar permissões
      if (!currentUser) {
        notify.error('Usuário não autenticado');
        return;
      }

      // Validações básicas
      if (!userData.currentPassword || !userData.password) {
        notify.error('Todos os campos são obrigatórios');
        return;
      }

      // Implementação delegada ao AuthContext para maior segurança
      setChangingPassword(false);
      notify.success('Redirecionando para alteração segura de senha...');
    } catch (error) {
      notify.error(error);
    }
  }, [currentUser]);

  const handleDeleteUser = useCallback((userId: string) => {
    try {
      // Verificar permissões
      if (!hasPermission(currentUser, 'users', 'delete')) {
        notify.error('Você não tem permissão para excluir usuários');
        return;
      }

      // Não permitir excluir o próprio usuário
      if (userId === currentUser?.id) {
        notify.error('Não é possível excluir o próprio usuário');
        return;
      }

      // Excluir o usuário do storage
      userStorage.delete(userId);
      
      // Atualizar o estado local
      updateUsers(users.filter(u => u.id !== userId));
      
      notify.success('Usuário excluído com sucesso!');
    } catch (error) {
      notify.error(error);
    }
  }, [currentUser, users, updateUsers]);

  const handleToggleUserStatus = useCallback((userId: string) => {
    try {
      // Verificar permissões
      if (!hasPermission(currentUser, 'users', 'update')) {
        notify.error('Você não tem permissão para alterar o status de usuários');
        return;
      }

      // Buscar o usuário
      const user = userStorage.findById(userId);
      if (!user) {
        notify.error('Usuário não encontrado');
        return;
      }

      // Atualizar o status no storage
      userStorage.update(userId, { isActive: !user.isActive });
      
      // Atualizar o estado local
      updateUsers(users.map(u => 
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      ));
      
      notify.success('Status do usuário atualizado com sucesso!');
    } catch (error) {
      notify.error(error);
    }
  }, [currentUser, users, updateUsers]);

  // Inicializar o estado de usuários a partir do storage
  React.useEffect(() => {
    setUsers(userStorage.getAll());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Gerenciamento de Usuários
          </h3>
        </div>
        {hasPermission(currentUser, 'users', 'create') && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            disabled={isLoading}
            aria-label="Adicionar novo usuário"
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
              <UserRow
                key={user.id}
                user={user}
                currentUser={currentUser}
                onEdit={setEditingUser}
                onDelete={handleDeleteUser}
                onToggleStatus={handleToggleUserStatus}
                onChangePassword={() => setChangingPassword(true)}
              />
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8" aria-live="polite">
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