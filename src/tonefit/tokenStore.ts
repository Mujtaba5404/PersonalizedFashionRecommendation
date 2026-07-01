// ToneFit token store (JWT persistence).
//
// Spec suggested AsyncStorage, but the app already ships react-native-mmkv, so
// we reuse it (no new native dependency / rebuild). Same outcome: the JWT is
// persisted across launches and attached as a Bearer token to protected calls.
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'tonefit' });
const KEY = 'tonefit.jwt';

export const tokenStore = {
  get(): string | null {
    return storage.getString(KEY) ?? null;
  },
  set(token: string): void {
    storage.set(KEY, token);
  },
  clear(): void {
    storage.delete(KEY);
  },
};
