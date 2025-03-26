import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import bcrypt from 'bcryptjs';
import { toast } from 'react-hot-toast';
import type { User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  isAuthenticated: false,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useLocalStorage<(User & { password: string })[]>('users', []);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        const user = users.find(u => u.id === decoded.id);
        if (user && user.isActive) {
          setUser(decoded);
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, [users]);

  const login = async (email: string, password: string) => {
    const user = users.find(u => u.email === email);
    
    if (!user || !user.isActive) {
      throw new Error('Usuário não encontrado ou inativo');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Senha incorreta');
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = generateToken(userWithoutPassword);
    localStorage.setItem('token', token);
    setUser(userWithoutPassword);

    // Update last login
    setUsers(prev => prev.map(u => 
      u.id === user.id 
        ? { ...u, lastLogin: new Date().toISOString() }
        : u
    ));

    toast.success('Login realizado com sucesso!');
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
    toast.success('Logout realizado com sucesso!');
  };

  const register = async ({ name, email, password }: RegisterData) => {
    if (users.some(u => u.email === email)) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User & { password: string } = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      role: users.length === 0 ? 'admin' : 'client', // First user is admin
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    setUsers(prev => [...prev, newUser]);
    toast.success('Cadastro realizado com sucesso!');
    navigate('/login');
  };

  const generateToken = (user: User): string => {
    // Simple token generation for demo purposes
    // In a real app, use a proper JWT library
    return btoa(JSON.stringify({ ...user, exp: Date.now() + 24 * 60 * 60 * 1000 }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);