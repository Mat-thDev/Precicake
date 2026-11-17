import { useAtomValue } from 'jotai';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import type { ComponentType } from 'react';
import { BottomBar, SkeletonPage } from './components';
import { storageReadyAtom } from './lib/storage';
import useRouter from './hooks/useRouter';
import useBackButton from './hooks/useBackButton';
import WelcomePage from './features/welcome';
import Home from './features/home';
import RecipesPage from './features/recipes';
import RecipeDetailPage from './features/recipe-detail';
import IngredientsPage from './features/ingredients';
import IngredientFormPage from './features/ingredient-form';

const ROUTER_MAPPING: Record<Router.Routes, ComponentType> = {
  Home,
  Welcome: WelcomePage,
  Recipes: RecipesPage,
  RecipeDetail: RecipeDetailPage,
  Ingredients: IngredientsPage,
  IngredientDetail: IngredientFormPage,
};

export default function App() {
  const storageReady = useAtomValue(storageReadyAtom);
  const { currentPage } = useRouter();

  // Volta nativa do Android: gesto/botão do sistema
  useBackButton();

  // Fallback para página persistida de versões antigas (ex.: 'Calculator')
  const Element = ROUTER_MAPPING[currentPage] ?? Home;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <main
        className={clsx(
          'min-h-0 flex-1 overflow-hidden',
          // Sem header, o conteúdo precisa descer da status bar (edge-to-edge)
          currentPage !== 'Welcome' && 'pt-safe',
        )}
      >
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
      <BottomBar />
    </div>
  );
}
