import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import type { User, UserRole } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  setAuthCookie,
  removeAuthCookie,
  generateSecureId,
  sanitizeUser
} from '../utils/security';
import { validateData, loginSchema, registerSchema, updatePasswordSchema } from '../utils/validation';
import { ZodError } from 'zod';

interface AuthContextData {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Função auxiliar para extrair mensagens de erro do ZodError
const getErrorMessage = (error: ZodError): string => {
  const formattedErrors = error.format();
  // Extrair a primeira mensagem de erro disponível
  return error.errors[0]?.message || 'Dados inválidos';
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  const [users, setUsers] = useLocalStorage<User[]>('users', []);
  const navigate = useNavigate();

  // Criar usuário administrador padrão se não existir nenhum usuário
  useEffect(() => {
    const createDefaultAdmin = async () => {
      if (users.length === 0) {
        const defaultAdmin: User = {
          id: generateSecureId(),
          name: 'Administrador',
          email: 'admin@assistentefinanceiro.com',
          password: await hashPassword('Admin@123'),
          role: 'admin' as UserRole,
          isActive: true,
          createdAt: new Date().toISOString()
        };
        setUsers([defaultAdmin]);
        toast.success('Usuário administrador padrão criado! Email: admin@assistentefinanceiro.com, Senha: Admin@123');
      }
    };
    createDefaultAdmin();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Validação dos dados de login
      const validation = validateData(loginSchema, { email, password });
      if (!validation.success) {
        throw new Error(getErrorMessage(validation.errors));
      }

      const user = users.find(u => u.email === email);
      if (!user || !user.password) {
        throw new Error('Email ou senha inválidos');
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        throw new Error('Email ou senha inválidos');
      }

      if (!user.isActive) {
        throw new Error('Usuário inativo');
      }

      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      
      // Sanitizar o usuário antes de armazenar no estado
      const safeUser = sanitizeUser(updatedUser);
      setCurrentUser(safeUser);

      // Usar implementação segura de token
      const token = await generateToken(safeUser);
      setAuthCookie(token);

      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Validação dos dados de registro
      const validation = validateData(registerSchema, { name, email, password, confirmPassword: password });
      if (!validation.success) {
        throw new Error(getErrorMessage(validation.errors));
      }

      if (users.some(u => u.email === email)) {
        throw new Error('Email já cadastrado');
      }

      const hashedPassword = await hashPassword(password);

      const newUser: User = {
        id: generateSecureId(),
        name,
        email,
        password: hashedPassword,
        role: 'user' as UserRole,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      setUsers(prev => [...prev, newUser]);

      // Sanitizar o usuário antes de armazenar no estado
      const safeUser = sanitizeUser(newUser);
      setCurrentUser(safeUser);

      // Usar implementação segura de token
      const token = await generateToken(safeUser);
      setAuthCookie(token);

      toast.success('Cadastro realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    removeAuthCookie();
    setCurrentUser(null);
    navigate('/login');
    toast.success('Logout realizado com sucesso!');
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // Validação dos dados de atualização de senha
      const validation = validateData(updatePasswordSchema, { 
        currentPassword, 
        password: newPassword, 
        confirmPassword: newPassword 
      });
      
      if (!validation.success) {
        throw new Error(getErrorMessage(validation.errors));
      }

      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const user = users.find(u => u.id === currentUser.id);
      if (!user || !user.password) {
        throw new Error('Usuário não encontrado');
      }

      const isValidPassword = await comparePassword(currentPassword, user.password);
      if (!isValidPassword) {
        throw new Error('Senha atual incorreta');
      }

      const hashedPassword = await hashPassword(newPassword);
      const updatedUser = {
        ...user,
        password: hashedPassword
      };

      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      
      // Sanitizar o usuário antes de armazenar no estado
      const safeUser = sanitizeUser(updatedUser);
      setCurrentUser(safeUser);

      toast.success('Senha atualizada com sucesso!');
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        register,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};