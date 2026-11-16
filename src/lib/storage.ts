import { atom, getDefaultStore } from 'jotai';
import { Preferences } from '@capacitor/preferences';

interface SyncStorageLike<Value> {
  getItem: (key: string, initialValue: Value) => Value;
  setItem: (key: string, newValue: Value) => void;
  removeItem: (key: string) => void;
}

export const STORAGE_KEYS = {
  app: 'app',
  user: 'userdata',
  nav: 'nav',
  recipes: 'recipes',
} as const;

/** Indica que o cache do Preferences foi hidratado (ou deu timeout) */
export const storageReadyAtom = atom(false);

const HYDRATE_TIMEOUT_MS = 2000;

const cache = new Map<string, string>();

function parse<T>(raw: string, initialValue: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return initialValue;
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('hydrate timeout')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function hydrateKey(key: string): Promise<void> {
  try {
    const { value } = await withTimeout(Preferences.get({ key }), HYDRATE_TIMEOUT_MS);
    if (value !== null) cache.set(key, value);
  } catch {
    // chave ausente ou timeout — mantém o valor inicial do átomo
  }
}

export async function hydrateStorage(): Promise<void> {
  try {
    await Promise.all(Object.values(STORAGE_KEYS).map(hydrateKey));
  } finally {
    getDefaultStore().set(storageReadyAtom, true);
  }
}

export function capacitorStorage<Value>(): SyncStorageLike<Value> {
  return {
    getItem: (key, initialValue) => {
      const raw = cache.get(key);
      return raw === undefined ? initialValue : parse(raw, initialValue);
    },
    setItem: (key, newValue) => {
      const raw = JSON.stringify(newValue);
      cache.set(key, raw);
      void Preferences.set({ key, value: raw }).catch(() => {});
    },
    removeItem: (key) => {
      cache.delete(key);
      void Preferences.remove({ key }).catch(() => {});
    },
  };
}
