/**
 * contexts/SettingsContext.tsx
 * Contexto para configurações globais (idioma e tema)
 * Data: 26 Dez 2025
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { Language, Translations } from '../types/i18n';
import { translations } from '../constants/translations';

type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsContextData {
  language: Language;
  themeMode: ThemeMode;
  isDark: boolean;
  t: Translations;
  setLanguage: (lang: Language) => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextData>({} as SettingsContextData);

const STORAGE_KEYS = {
  LANGUAGE: 'bumbar_language',
  THEME: 'bumbar_theme',
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [language, setLanguageState] = useState<Language>('pt');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  // Carregar configurações ao iniciar
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [storedLang, storedTheme] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
      ]);

      if (storedLang) {
        setLanguageState(storedLang as Language);
      }
      if (storedTheme) {
        setThemeModeState(storedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Erro ao salvar idioma:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  // Determinar se o tema é escuro
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');

  // Obter traduções do idioma atual
  const t = translations[language];

  return (
    <SettingsContext.Provider
      value={{
        language,
        themeMode,
        isDark,
        t,
        setLanguage,
        setThemeMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
  }
  return context;
};
