/**
 * Arquivo de exemplo para configurações de segurança
 * Copie este arquivo para security.config.ts e substitua os valores
 * com as suas configurações de produção
 */

// Chave secreta para assinatura de JWT
// Em produção, deve ser uma chave forte e armazenada em variáveis de ambiente
export const JWT_SECRET_KEY = new TextEncoder().encode(
  'sua-chave-secreta-deve-ser-longa-e-aleatoria-aqui'
);

// Opções para cookies de autenticação
export const COOKIE_OPTIONS = {
  expires: 7, // 7 dias
  sameSite: 'strict' as const,
  path: '/',
  secure: true, // Deve ser true em produção
};

// Configuração de algoritmo para JWT
export const JWT_ALGORITHM = 'HS256';

// Tempo de expiração do token
export const TOKEN_EXPIRATION = '7d'; // 7 dias

// Configuração do salt para hashing de senha
export const PASSWORD_SALT_ROUNDS = 12; 