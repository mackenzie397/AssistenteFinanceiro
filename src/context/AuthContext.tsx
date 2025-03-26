import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import bcrypt from 'bcryptjs';
import { toast } from 'react-hot-toast';
import type { User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextData {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  const [users, setUsers] = useLocalStorage<User[]>('users', []);
  const navigate = useNavigate();

  // Criar usuário administrador padrão se não existir nenhum usuário
  useEffect(() => {
    const createDefaultAdmin = async () => {
      if (users.length === 0) {
        const defaultAdmin: User = {
          id: crypto.randomUUID(),
          name: 'Administrador',
          email: 'admin@assistentefinanceiro.com',
          password: await bcrypt.hash('Admin@123', 10),
          role: 'admin',
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
      const user = users.find(u => u.email === email);
      if (!user || !user.password) {
        throw new Error('Email ou senha inválidos');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
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
      
      // Não enviar a senha para o estado do usuário atual
      const userWithoutPassword = { ...updatedUser };
      delete userWithoutPassword.password;
      setCurrentUser(userWithoutPassword);

      const token = generateToken(userWithoutPassword);
      localStorage.setItem('token', token);

      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      if (users.some(u => u.email === email)) {
        throw new Error('Email já cadastrado');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        email,
        password: hashedPassword,
        role: 'client',
        isActive: true,
        createdAt: new Date().toISOString()
      };

      setUsers(prev => [...prev, newUser]);

      // Não enviar a senha para o estado do usuário atual
      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;
      setCurrentUser(userWithoutPassword);

      const token = generateToken(userWithoutPassword);
      localStorage.setItem('token', token);

      toast.success('Cadastro realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
    toast.success('Logout realizado com sucesso!');
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const user = users.find(u => u.id === currentUser.id);
      if (!user || !user.password) {
        throw new Error('Usuário não encontrado');
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        throw new Error('Senha atual incorreta');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = {
        ...user,
        password: hashedPassword
      };

      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      
      // Não enviar a senha para o estado do usuário atual
      const userWithoutPassword = { ...updatedUser };
      delete userWithoutPassword.password;
      setCurrentUser(userWithoutPassword);

      toast.success('Senha atualizada com sucesso!');
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  };

  const generateToken = (user: User): string => {
    return btoa(JSON.stringify({
      ...user,
      exp: Date.now() + 24 * 60 * 60 * 1000
    }));
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