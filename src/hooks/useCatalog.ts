import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { catalogAtom } from '../atoms';

const useCatalog = () => {
  const [ingredients, setIngredients] = useAtom(catalogAtom);

  const addIngredient = useCallback(
    (ingredient: Omit<Catalog.Item, 'id' | 'createdAt'>) => {
      const item: Catalog.Item = {
        ...ingredient,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      setIngredients((prev) => [item, ...prev]);
      return item;
    },
    [setIngredients],
  );

  const updateIngredient = useCallback(
    (id: string, patch: Partial<Catalog.Item>) => {
      setIngredients((prev) =>
        prev.map((ingredient) => (ingredient.id === id ? { ...ingredient, ...patch } : ingredient)),
      );
    },
    [setIngredients],
  );

  const removeIngredient = useCallback(
    (id: string) => setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id)),
    [setIngredients],
  );

  return { ingredients, addIngredient, updateIngredient, removeIngredient };
};

export default useCatalog;
