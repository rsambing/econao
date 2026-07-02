/**
 * Utils - Validation
 * Data: 26 Dez 2025
 * 
 * Funções de validação de formulários
 */

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida formato de telefone de Angola (+244 XXX XXX XXX)
 */
export const validatePhone = (phone: string): boolean => {
  // Remove espaços e traços
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  // Formato: +244XXXXXXXXX (9 dígitos após +244)
  const phoneRegex = /^\+244\d{9}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * Valida senha com requisitos de segurança
 * - Mínimo 8 caracteres
 * - Pelo menos uma letra maiúscula
 * - Pelo menos uma letra minúscula
 * - Pelo menos um número
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Mínimo 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Pelo menos uma letra minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Pelo menos um número');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida nome completo (mínimo 2 palavras)
 */
export const validateFullName = (name: string): boolean => {
  const trimmedName = name.trim();
  const words = trimmedName.split(/\s+/);
  return words.length >= 2 && words.every(word => word.length > 0);
};

/**
 * Formata telefone para formato de exibição
 */
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  if (cleanPhone.startsWith('+244') && cleanPhone.length === 13) {
    // +244 XXX XXX XXX
    return `${cleanPhone.substring(0, 4)} ${cleanPhone.substring(4, 7)} ${cleanPhone.substring(7, 10)} ${cleanPhone.substring(10)}`;
  }
  
  return phone;
};

/**
 * Valida código de verificação (6 dígitos)
 */
export const validateVerificationCode = (code: string): boolean => {
  return /^\d{6}$/.test(code);
};
