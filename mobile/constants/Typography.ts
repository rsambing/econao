/**
 * Bumbar Design System - Typography
 * Data: 26 Dez 2025
 * 
 * Sistema de tipografia com tamanhos e pesos consistentes
 */

export const Typography = {
  // Font Families (Modern SaaS Stack - Inter carregada via Expo)
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,     // Micro copy
    sm: 14,     // Secondary/Labels
    md: 16,     // Body base
    lg: 18,     // Large Body / Small Heading
    xl: 20,     // H3
    xxl: 24,    // H2
    xxxl: 32,   // H1
  },
  
  // Font Weights
  fontWeight: {
    regular: '400' as '400',
    medium: '500' as '500',
    semibold: '600' as '600',
    bold: '700' as '700',
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,    // For Headings
    normal: 1.5,   // For compact UI elements
    relaxed: 1.6,  // For Body text (SaaS standard)
  },

  // Presets para facilitar o uso (Inspirado em Design Systems modernos)
  presets: {
    h1: {
      fontFamily: 'Inter_700Bold',
      fontSize: 32,
      fontWeight: '700' as '700',
      lineHeight: 38,
      letterSpacing: -0.64, // -0.02em approx
    },
    h2: {
      fontFamily: 'Inter_700Bold',
      fontSize: 24,
      fontWeight: '700' as '700',
      lineHeight: 30,
      letterSpacing: -0.48,
    },
    h3: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 20,
      fontWeight: '600' as '600',
      lineHeight: 26,
      letterSpacing: -0.4,
    },
    body: {
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      fontWeight: '400' as '400',
      lineHeight: 26, // ~1.6
    },
    bodyLarge: {
      fontFamily: 'Inter_400Regular',
      fontSize: 18,
      fontWeight: '400' as '400',
      lineHeight: 28, // 1.6 - Relaxed
    },
    label: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      fontWeight: '500' as '500',
      lineHeight: 20,
    },
    cta: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
      fontWeight: '600' as '600',
      lineHeight: 24,
      letterSpacing: 0,
    },
  }
};
