import { atomWithStorage } from 'jotai/utils';

export const navigationAtom = atomWithStorage<Router.NavState>('nav', {
  current: { page: 'Welcome' },
  stack: [],
});
