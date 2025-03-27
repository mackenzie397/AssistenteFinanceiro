import bcrypt from 'bcryptjs';
import Cookies from 'js-cookie';
import * as jose from 'jose';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '../types/index';

// Chave secreta para assinatura de JWT (em produção, deve ser armazenada em variáveis de ambiente)
// Esta é uma chave temporária apenas para desenvolvimento
const JWT_SECRET_KEY = new TextEncoder().encode(
  'assistente-financeiro-secret-key-2024-temp-dev-only'
);

// Cache da chave secreta para não precisar recriar a cada vez
let secretKeyPromise: Promise<CryptoKey> | null = null;

/**
 * Obtém a chave secreta para JWT
 */
const getSecretKey = async (): Promise<CryptoKey> => {
  if (!secretKeyPromise) {
    secretKeyPromise = crypto.subtle.importKey(
      'raw',
      JWT_SECRET_KEY,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );
  }
  return secretKeyPromise;
};

/**
 * Gera um hash da senha usando bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  // 12 rounds é um bom equilíbrio entre segurança e desempenho
  const salt = await bcrypt.genSalt(12); 
  return bcrypt.hash(password, salt);
};

/**
 * Compara uma senha em texto plano com um hash usando bcrypt
 * com comparação de tempo constante para prevenir timing attacks
 */
export const comparePassword = async (
  password: string, 
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Gera um token JWT para autenticação
 */
export const generateToken = async (user: Omit<User, 'password'>): Promise<string> => {
  // Nunca incluir dados sensíveis no payload do token
  const safeUser = { ...user };
  delete (safeUser as any).password;
  
  const secretKey = await getSecretKey();
  
  // Gera o token com os dados do usuário e configurações seguras
  return new jose.SignJWT({ ...safeUser })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')  // Token expira em 7 dias
    .setSubject(safeUser.id)
    .sign(secretKey);
};

/**
 * Verifica e decodifica um token JWT
 */
export const verifyToken = async (token: string): Promise<User | null> => {
  try {
    const secretKey = await getSecretKey();
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload as unknown as User;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
};

/**
 * Armazena o token em um cookie seguro
 */
export const setAuthCookie = (token: string): void => {
  // Em produção, use { secure: true, sameSite: 'strict' }
  Cookies.set('auth_token', token, { 
    expires: 7, // 7 dias
    sameSite: 'strict',
    path: '/'
  });
};

/**
 * Obtém o token do cookie
 */
export const getAuthCookie = (): string | undefined => {
  return Cookies.get('auth_token');
};

/**
 * Remove o cookie de autenticação
 */
export const removeAuthCookie = (): void => {
  Cookies.remove('auth_token', { path: '/' });
};

/**
 * Gera um UUID seguro para identificadores
 */
export const generateSecureId = (): string => {
  return uuidv4();
};

/**
 * Verifica se um usuário tem permissão para um recurso específico
 */
export const hasPermission = (
  user: User | null, 
  resource: string, 
  action: 'create' | 'read' | 'update' | 'delete'
): boolean => {
  if (!user) return false;
  
  // Mapeamento de permissões por função
  const permissions: Record<string, Record<string, string[]>> = {
    admin: {
      users: ['create', 'read', 'update', 'delete'],
      transactions: ['create', 'read', 'update', 'delete'],
      goals: ['create', 'read', 'update', 'delete'],
      settings: ['read', 'update']
    },
    user: {
      users: ['read'],
      transactions: ['create', 'read', 'update', 'delete'],
      goals: ['create', 'read', 'update', 'delete'],
      settings: ['read', 'update']
    }
  };
  
  return Boolean(permissions[user.role]?.[resource]?.includes(action));
};

/**
 * Sanitiza dados de usuário removendo informações sensíveis
 */
export const sanitizeUser = (user: User): Omit<User, 'password'> => {
  // Cria uma cópia sem a senha
  const { password, ...safeUser } = user;
  return safeUser;
}; 