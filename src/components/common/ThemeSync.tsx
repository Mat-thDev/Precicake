import { useEffect } from 'react';
import useTheme from '../../hooks/useTheme';
import { applyStatusBarTheme } from '../../lib/native';

/**
 * Sincroniza o tema com o DOM e a status bar.
 * Montado só após `storageReady` — a primeira leitura de appStateAtom
 * precisa acontecer depois da hidratação (o átomo não re-lê sozinho).
 */
export const ThemeSync = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    void applyStatusBarTheme(theme);
  }, [theme]);

  return null;
};

export default ThemeSync;
