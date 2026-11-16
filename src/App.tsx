import { useAtomValue } from 'jotai';
import { AnimatePresence, motion } from 'framer-motion';
import type { ComponentType } from 'react';
import { Navbar, NotFound } from './components';
import { appStateAtom } from './atoms';
import useRouter from './hooks/useRouter';
import useBackButton from './hooks/useBackButton';
import WelcomePage from './features/welcome';
import Home from './features/home';

const ROUTER_MAPPING: Record<Router.Routes, ComponentType> = {
  Home,
  Welcome: WelcomePage,
  // TODO: substituir pelo componente real de cada rota
  Calculator: NotFound,
  Recipes: NotFound,
  Ingredients: NotFound,
};

export default function App() {
  const { appName } = useAtomValue(appStateAtom);
  const { currentPage } = useRouter();

  // Volta nativa do Android: gesto/botão do sistema
  useBackButton();

  const Element = ROUTER_MAPPING[currentPage];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Navbar title={appName} />
      <main className="min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            className="h-full w-full"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Element />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
