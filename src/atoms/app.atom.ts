import { atomWithStorage } from 'jotai/utils';

const DEFAULT_STATE: App.AppState = {
  appName: 'Precicake',
  initialize: false,
  version: '1.0.0',
};

export const appStateAtom = atomWithStorage<App.AppState>('app', DEFAULT_STATE);
