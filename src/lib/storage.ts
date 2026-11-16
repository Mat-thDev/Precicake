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
} as const;

const cache = new Map<string, string>();

function parse<T>(raw: string, initialValue: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return initialValue;
  }
}

export async function hydrateStorage(): Promise<void> {
  const results = await Promise.all(
    Object.values(STORAGE_KEYS).map(async (key) => {
      try {
        const { value } = await Preferences.get({ key });
        return [key, value] as const;
      } catch {
        return [key, null] as const;
      }
    }),
  );

  for (const [key, value] of results) {
    if (value !== null) cache.set(key, value);
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
