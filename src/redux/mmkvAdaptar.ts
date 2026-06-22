import { createMMKV } from 'react-native-mmkv';
import { Storage } from 'redux-persist';

/**
 * Shared MMKV instance for the whole app.
 * Use this for any fast key/value persistence (tokens, flags, cache, etc.).
 */
export const storage = createMMKV({
  id: 'tonefit-storage',
});

/**
 * redux-persist storage engine backed by MMKV.
 * MMKV is synchronous, so we just wrap the calls in resolved promises
 * to satisfy redux-persist's async `Storage` contract.
 */
export const mmkvStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: key => {
    storage.remove(key);
    return Promise.resolve();
  },
};
