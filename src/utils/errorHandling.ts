import { ZodError } from 'zod';
import { toast } from 'react-hot-toast';

/**
 * Extrai a primeira mensagem de erro de um ZodError
 */
export const getErrorMessage = (error: ZodError): string => {
  return error.errors[0]?.message || 'Dados inválidos';
};

/**
 * Função para tratamento padronizado de erros na aplicação
 * @param error O erro a ser tratado
 * @param customMessage Mensagem personalizada opcional para exibir no lugar da mensagem de erro padrão
 */
export const handleError = (error: unknown, customMessage?: string): void => {
  if (customMessage) {
    toast.error(customMessage);
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else if (error instanceof ZodError) {
    toast.error(getErrorMessage(error));
  } else if (typeof error === 'string') {
    toast.error(error);
  } else {
    toast.error('Ocorreu um erro inesperado');
  }
  console.error(error);
};

/**
 * Função para exibir mensagens de sucesso
 */
export const handleSuccess = (message: string): void => {
  toast.success(message);
};

/**
 * Objeto com funções de notificação para uso em componentes
 */
export const notify = {
  success: handleSuccess,
  error: handleError,
  info: (message: string) => toast(message),
  warning: (message: string) => toast.error(message)
}; 