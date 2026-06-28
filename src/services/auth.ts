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
 * @param forceRefresh  Skip the cached token and log in again. Use this after a
 *                      request fails with 401 because the persisted token has
 *                      expired / belongs to an old backend session.
 * @returns the token string, or null if none could be obtained.
 */
export const ensureAuthToken = async (
  forceRefresh = false,
): Promise<string | null> => {
  const state = store.getState();
  const existing = state?.role?.userAuthToken;
  if (existing && !forceRefresh) return existing;

  const pending = state?.role?.pendingAuth;
  if (!pending?.email || !pending?.password) {
    console.log('[ensureAuthToken] no usable credentials to log in with');
    return null;
  }

  const { response, error } = await apiHelper('POST', 'login', {}, {}, {
    email: pending.email,
    password: pending.password,
  });

  if (error) {
    console.log('[ensureAuthToken] silent login failed:', error);
  }
  console.log('[ensureAuthToken] login response data:', response?.data);

  // Tolerate the few shapes a backend may use to return the token.
  const data: any = response?.data ?? {};
  const token =
    data.access_token ??
    data.token ??
    data.accessToken ??
    data.data?.access_token ??
    data.data?.token ??
    null;

  if (token) {
    store.dispatch(setUserAuthToken(token));
    return token;
  }
  return null;
};
