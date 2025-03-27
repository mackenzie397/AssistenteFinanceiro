# Configurações do Projeto

Este diretório contém arquivos de configuração para a aplicação. Alguns desses arquivos contêm informações sensíveis e **não devem ser versionados**.

## Arquivos de configuração

### admin.config.ts

Este arquivo contém as credenciais do usuário administrador. Para configurá-lo:

1. Copie o arquivo `admin.config.example.ts` para `admin.config.ts`
2. Modifique o email, senha e outras informações conforme necessário

```typescript
// Exemplo de admin.config.ts
import type { User } from '../types';

export const adminUser: User = {
  id: 'admin',
  name: 'Administrador',
  email: 'seu-email@exemplo.com', // Altere este email
  password: 'senha-segura', // Altere esta senha
  role: 'admin',
  isActive: true,
  createdAt: new Date().toISOString()
};
```

### Outros arquivos de configuração

Para adicionar novos arquivos de configuração sensíveis:

1. Crie um arquivo `.example.ts` como modelo
2. Adicione instruções claras sobre como configurar
3. Adicione o arquivo real ao `.gitignore` para evitar versionamento

## Boas práticas

- Nunca comite credenciais reais para o repositório
- Mantenha chaves secretas em variáveis de ambiente quando possível
- Use os arquivos `.example.ts` como modelos para os arquivos reais
- Em produção, considere usar sistemas seguros de gerenciamento de segredos

## Configuração em desenvolvimento vs produção

Em desenvolvimento, estes arquivos são usados para facilitar a configuração local. Em produção, idealmente as configurações devem vir de:

- Variáveis de ambiente
- Sistemas de gerenciamento de segredos
- Valores injetados no momento da implantação 