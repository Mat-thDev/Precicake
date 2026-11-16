import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import useRouter from './useRouter';

/**
 * Botão/volta nativo do Android (gesto e botão do sistema):
 * - com histórico → volta para a página anterior (stack do useRouter)
 * - na página raiz (Welcome) → fecha o app
 */
const useBackButton = () => {
  const { canGoBack, goBack } = useRouter();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const setup = async () => {
      await CapApp.addListener('backButton', () => {
        if (canGoBack) goBack();
        else void CapApp.exitApp();
      });
    };

    void setup();

    return () => {
      void CapApp.removeAllListeners();
    };
  }, [canGoBack, goBack]);
};

export default useBackButton;
