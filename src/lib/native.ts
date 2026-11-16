import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Inicializa os plugins nativos Android no boot.
 * No navegador (dev com `npm run dev`) não faz nada.
 */
export const initNative = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // Ícones escuros — a barra fica sobre o fundo branco-gelo (navbar/onda)
    await StatusBar.setStyle({ style: Style.Dark });
  } catch {
    // Plataforma sem suporte ao plugin — ignora
  }
};
