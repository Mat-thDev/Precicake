import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Inicializa os plugins nativos Android no boot.
 * No navegador (dev com `npm run dev`) não faz nada.
 */
export const initNative = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  await applyStatusBarTheme('default');
};

/**
 * Ícones da status bar conforme o tema:
 * fundo claro → ícones escuros (Style.Dark); fundo escuro → claros (Style.Light).
 */
export const applyStatusBarTheme = async (theme: App.Theme): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.setStyle({ style: theme === 'chocolate' ? Style.Light : Style.Dark });
  } catch {
    // Plataforma sem suporte ao plugin — ignora
  }
};
