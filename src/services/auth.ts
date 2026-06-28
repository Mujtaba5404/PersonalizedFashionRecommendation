import { setUserAuthToken } from '../redux/slice/roleSlice';
import { store } from '../redux/store';
import { apiHelper } from './index';

/**
 * Ensures we have a Bearer token for auth-protected endpoints.
 *
 * The backend issues a token only from POST /login (verify-otp / register
 * return none). To avoid forcing a freshly-registered user through a separate
 * sign-in screen, we silently log in with the credentials captured at
 * registration (stored as `role.pendingAuth`).
 *
 * @returns the token string, or null if none could be obtained.
 */
export const ensureAuthToken = async (): Promise<string | null> => {
  const state = store.getState();
  const existing = state?.role?.userAuthToken;
  if (existing) return existing;

  const pending = state?.role?.pendingAuth;
  if (!pending?.email || !pending?.password) return null;

  const { response } = await apiHelper('POST', 'login', {}, {}, {
    email: pending.email,
    password: pending.password,
  });

  const token = response?.data?.access_token;
  if (token) {
    store.dispatch(setUserAuthToken(token));
    return token;
  }
  return null;
};
