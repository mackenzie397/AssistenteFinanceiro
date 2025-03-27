import type { User } from '../types';

// Renomeie este arquivo para admin.config.ts e altere as credenciais
export const adminUser: User = {
  id: 'admin',
  name: 'Administrador',
  email: 'seu-email@exemplo.com', // Altere este email
  password: 'senha-segura', // Altere esta senha
  role: 'admin',
  isActive: true,
  createdAt: new Date().toISOString()
};