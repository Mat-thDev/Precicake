import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { recipesAtom } from '../atoms';

const useRecipes = () => {
  const [recipes, setRecipes] = useAtom(recipesAtom);

  const addRecipe = useCallback(
    (recipe: Omit<Recipe.Item, 'id' | 'createdAt'>) => {
      const item: Recipe.Item = {
        ...recipe,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      setRecipes((prev) => [item, ...prev]);
      return item;
    },
    [setRecipes],
  );

  const updateRecipe = useCallback(
    (id: string, patch: Partial<Recipe.Item>) => {
      setRecipes((prev) =>
        prev.map((recipe) => (recipe.id === id ? { ...recipe, ...patch } : recipe)),
      );
    },
    [setRecipes],
  );

  const removeRecipe = useCallback(
    (id: string) => setRecipes((prev) => prev.filter((recipe) => recipe.id !== id)),
    [setRecipes],
  );

  return { recipes, addRecipe, updateRecipe, removeRecipe };
};

export default useRecipes;
