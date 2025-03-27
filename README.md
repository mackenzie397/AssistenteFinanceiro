# Assistente Financeiro

![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6)
![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-06B6D4)
![Zod](https://img.shields.io/badge/Validation-Zod-3068B7)
![Axios](https://img.shields.io/badge/HTTP-Axios-5A29E4)

Aplicação web para controle financeiro pessoal, com gerenciamento de receitas, despesas, investimentos e metas financeiras. Desenvolvido com React, TypeScript e armazenamento persistente.

## 🖥️ Preview  
*Em desenvolvimento*

## ✨ Funcionalidades  
- **Dashboard:**  
  - Resumo financeiro mensal (saldo atual, receitas, despesas).  
  - Gráficos de distribuição por categoria.  
- **Transações:**
  - Registro de receitas e despesas.
  - Filtros e pesquisa avançada.
  - Categorização e etiquetas personalizadas.
- **Metas Financeiras:**  
  - Acompanhamento de metas de economia e investimento.  
  - Progresso visual e projeções.  
- **Categorias:**  
  - Criação e gerenciamento de categorias personalizadas.
- **Relatórios:**  
  - Visualização por períodos e exportação.
  - Análises de gastos e receitas.

## 🧩 Arquitetura

### Hooks Personalizados
- **useLocalStorage**: Persistência de dados local com tipagem.
- **useAuth**: Autenticação e gerenciamento de sessão.
- **useStore**: Gerenciamento de estado global.
- **useTheme**: Tema claro/escuro com persistência.
- **useForm**: Gerenciamento de formulários com validação via Zod.
- **usePagination**: Paginação de listas e tabelas.
- **useMediaQuery**: Responsividade e breakpoints.
- **useFocusTrap**: Acessibilidade para modais e menus.
- **useAnimationFrame**: Animações otimizadas.
- **useKeyboard**: Atalhos de teclado e acessibilidade.

### Contextos
- **AuthContext**: Autenticação e controle de usuários.
- **StoreContext**: Estado global e gerenciamento de notificações.

### Utilidades
- **Validação**: Esquemas Zod para validação de dados.
- **Armazenamento**: Interface unificada para diferentes métodos de persistência.
- **Formatação**: Funções para formatação de valores monetários e datas.
- **Segurança**: Criptografia e proteção de dados sensíveis.
- **Tratamento de Erros**: Sistema centralizado de notificações e logs.

## 🔒 Segurança

Esta aplicação implementa várias medidas de segurança:

- **Armazenamento de Credenciais**: Senhas são armazenadas com hash usando bcrypt.
- **Autenticação**: Tokens JWT para sessões seguras.
- **Sanitização de Dados**: Validação de entrada com Zod.
- **Proteção de Configurações**: Arquivos de configuração sensíveis não são versionados.

### Configuração Segura

Antes de executar o projeto, é necessário configurar os arquivos sensíveis:

1. Copie os arquivos de exemplo para suas versões reais:
   ```bash
   cp src/config/admin.config.example.ts src/config/admin.config.ts
   cp src/utils/security.config.example.ts src/utils/security.config.ts
   ```

2. Edite os arquivos criados com suas configurações seguras.

3. Nunca comite estes arquivos para o repositório.

Veja mais detalhes em [src/config/README.md](src/config/README.md).

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Configurar arquivos sensíveis (siga as instruções acima)

# Iniciar servidor de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Executar testes
npm test

# Verificar estilo e padrões de código
npm run lint
```

## 📁 Estrutura do Projeto

```
/src
  /components     # Componentes React
  /contexts       # Contextos React para estado global
  /hooks          # Hooks personalizados
  /pages          # Páginas da aplicação
  /services       # Serviços externos (API)
  /utils          # Funções utilitárias
  /types          # Definições de tipos TypeScript
  /assets         # Recursos estáticos
  /config         # Configurações da aplicação (alguns arquivos são confidenciais)
```

## 📄 Licença

MIT
