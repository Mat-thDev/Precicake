import { atomWithStorage } from 'jotai/utils';
import { capacitorStorage, STORAGE_KEYS } from '../lib/storage';

export const userAtom = atomWithStorage<User.UserData>(
  STORAGE_KEYS.user,
  { username: null },
  capacitorStorage(),
);
