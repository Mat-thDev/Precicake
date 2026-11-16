import { atomWithStorage } from 'jotai/utils';
import { capacitorStorage, STORAGE_KEYS } from '../lib/storage';

export const navigationAtom = atomWithStorage<Router.NavState>(
  STORAGE_KEYS.nav,
  {
    current: { page: 'Welcome' },
    stack: [],
  },
  capacitorStorage(),
);
