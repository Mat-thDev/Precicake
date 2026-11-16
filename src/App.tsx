import { useAtomValue } from 'jotai';
import { AnimatePresence, motion } from 'framer-motion';
import type { ComponentType } from 'react';
import { Navbar, NotFound, SkeletonPage } from './components';
import { appStateAtom } from './atoms';
import { storageReadyAtom } from './lib/storage';
import useRouter from './hooks/useRouter';
import useBackButton from './hooks/useBackButton';
import WelcomePage from './features/welcome';
import Home from './features/home';
import RecipesPage from './features/recipes';
import RecipeDetailPage from './features/recipe-detail';

const ROUTER_MAPPING: Record<Router.Routes, ComponentType> = {
  Home,
  Welcome: WelcomePage,
  Recipes: RecipesPage,
  RecipeDetail: RecipeDetailPage,
  // TODO: substituir pelo componente real de cada rota
  Ingredients: NotFound,
};

export default function App() {
  const { appName } = useAtomValue(appStateAtom);
  const storageReady = useAtomValue(storageReadyAtom);
  const { currentPage } = useRouter();

  // Volta nativa do Android: gesto/botão do sistema
  useBackButton();

  // Fallback para página persistida de versões antigas (ex.: 'Calculator')
  const Element = ROUTER_MAPPING[currentPage] ?? Home;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Navbar title={appName} />
      <main className="min-h-0 flex-1 overflow-hidden">
        {!storageReady ? (
          <SkeletonPage />
        ) : (
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
        )}
      </main>
    </div>
  );
}
