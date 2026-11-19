import { atomWithStorage } from 'jotai/utils';
import { capacitorStorage, STORAGE_KEYS } from '../lib/storage';

const DEFAULT_STATE: App.AppState = {
  appName: 'Precicake',
  initialize: false,
  version: '1.0.0',
  theme: 'default',
};

export const appStateAtom = atomWithStorage<App.AppState>(
  STORAGE_KEYS.app,
  DEFAULT_STATE,
  capacitorStorage(),
);
