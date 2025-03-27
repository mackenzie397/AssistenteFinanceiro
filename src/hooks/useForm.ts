import { useState, useCallback, ChangeEvent } from 'react';
import { ZodSchema } from 'zod';
import { handleError } from '../utils/errorHandling';

interface FormErrors {
  [key: string]: string;
}

export interface FormOptions<T> {
  initialValues: T;
  validationSchema?: ZodSchema<T>;
  onSubmit?: (values: T) => void | Promise<void>;
}

/**
 * Hook para gerenciar formulários com validação
 */
export function useForm<T extends Record<string, any>>(options: FormOptions<T>) {
  const { initialValues, validationSchema, onSubmit } = options;
  
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Função para lidar com mudanças nos inputs
  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
    
    if (touched[name] && validationSchema) {
      validateField(name, value);
    }
  }, [touched, validationSchema]);

  // Função para validar um campo específico
  const validateField = useCallback((name: string, value: any) => {
    if (!validationSchema) return;
    
    try {
      // Construir um objeto temporário para validação
      const fieldsToValidate = { [name]: value } as unknown as T;
      
      // Validar apenas este campo usando refinamento
      validationSchema.parse({ ...values, ...fieldsToValidate });
      
      // Se chegar aqui, está válido
      setErrors(prev => ({ ...prev, [name]: '' }));
    } catch (error: any) {
      if (error.errors) {
        // Erro do Zod
        const fieldError = error.errors.find((e: any) => 
          e.path.includes(name)
        );
        
        if (fieldError) {
          setErrors(prev => ({ ...prev, [name]: fieldError.message }));
        }
      } else {
        // Erro genérico
        handleError(error);
      }
    }
  }, [validationSchema, values]);
  
  // Marcar um campo como tocado
  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validationSchema) {
      validateField(name, values[name]);
    }
  }, [validateField, validationSchema, values]);
  
  // Validar todos os campos do formulário
  const validateForm = useCallback(() => {
    if (!validationSchema) return true;
    
    try {
      validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: FormErrors = {};
      
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
      }
      
      setErrors(newErrors);
      return false;
    }
  }, [validationSchema, values]);
  
  // Manipulador para submissão do formulário
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Marcar todos os campos como tocados
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);
    
    // Validar o formulário
    const isValid = validateForm();
    
    if (isValid && onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        handleError(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [onSubmit, validateForm, values]);
  
  // Resetar o formulário
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  // Definir um valor específico programaticamente
  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues
  };
} 