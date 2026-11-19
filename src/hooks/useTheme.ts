import { useAtom } from 'jotai';
import { appStateAtom } from '../atoms';

/**
 * Tema visual (DaisyUI): 'default' (branco-gelo) ou 'chocolate' (escuro).
 * Persistido em appStateAtom — sem chave nova de storage.
 */
export const useTheme = () => {
  const [appState, setAppState] = useAtom(appStateAtom);
  // Estado persistido de versões antigas pode não ter o campo
  const theme: App.Theme = appState.theme ?? 'default';

  const setTheme = (next: App.Theme) => setAppState((state) => ({ ...state, theme: next }));

  const toggleTheme = () => setTheme(theme === 'chocolate' ? 'default' : 'chocolate');

  return { theme, setTheme, toggleTheme };
};

export default useTheme;
