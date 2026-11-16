import { atomWithStorage } from 'jotai/utils';
import { capacitorStorage, STORAGE_KEYS } from '../lib/storage';

export const catalogAtom = atomWithStorage<Catalog.Item[]>(
  STORAGE_KEYS.ingredients,
  [],
  capacitorStorage(),
);
