/**
 * hooks/useTranslation.ts
 * Hook para acessar as traduções do Bumbar
 * Data: 27 Dez 2025
 */

import { useSettings } from '../contexts/SettingsContext';
import { Translations, Language } from '../types/i18n';

interface UseTranslationReturn {
  t: (key: string) => string;
  translations: Translations;
  language: Language;
}

/**
 * Hook para acessar as traduções com função helper
 * Permite acessar traduções por path: t('home.title')
 */
export const useTranslation = (): UseTranslationReturn => {
  const { t: translations, language } = useSettings();
  
  /**
   * Função para obter tradução por path (ex: 'home.title')
   */
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    if (typeof value === 'string') {
      return value;
    }
    
    console.warn(`Translation key "${key}" is not a string`);
    return key;
  };
  
  return {
    t,
    translations,
    language,
  };
};
