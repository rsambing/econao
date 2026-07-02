/**
 * hooks/useBumbarTheme.ts
 * Hook para acessar o tema do Bumbar
 * Data: 26 Dez 2025
 */

import { Colors } from '../constants/colors';
import { useSettings } from '../contexts/SettingsContext';

export const useBumbarTheme = () => {
  const { isDark } = useSettings();
  
  return {
    colors: isDark ? Colors.dark : Colors.light,
    isDark,
  };
};
