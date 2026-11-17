import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { recipesAtom } from '../atoms';
import { uuid } from '../lib/utils';

const useRecipes = () => {
  const [recipes, setRecipes] = useAtom(recipesAtom);

  const addRecipe = useCallback(
    (recipe: Omit<Recipe.Item, 'id' | 'createdAt'>) => {
      const item: Recipe.Item = {
        ...recipe,
        id: uuid(),
        createdAt: new Date().toISOString(),
      };

      setRecipes((prev) => [item, ...prev]);
      return item;
    },
    [setRecipes],
  );

  /** Cria receita vazia com os padrões do app e retorna o item criado */
  const createRecipe = useCallback(
    () =>
      addRecipe({
        name: '',
        ingredients: [],
        percentCost: 3.5,
        additionalCosts: [],
        multiplier: 3,
      }),
    [addRecipe],
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

  return { recipes, addRecipe, createRecipe, updateRecipe, removeRecipe };
};

export default useRecipes;
