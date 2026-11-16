import { atomWithStorage } from 'jotai/utils';
import { capacitorStorage, STORAGE_KEYS } from '../lib/storage';

export const recipesAtom = atomWithStorage<Recipe.Item[]>(
  STORAGE_KEYS.recipes,
  [],
  capacitorStorage(),
);
