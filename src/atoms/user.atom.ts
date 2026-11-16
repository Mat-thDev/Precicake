import { atomWithStorage } from 'jotai/utils';

export const userAtom = atomWithStorage<User.UserData>('userdata', { username: null });
