import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Shape of the authenticated user. Extend to match the user object returned
 * by the auth API once the contract is finalized.
 */
export interface User {
  id?: string | number;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  [key: string]: unknown;
}

export type Role = 'customer' | 'brand' | null;

interface PendingAuth {
  email: string;
  password: string;
}

export interface ArPhoto {
  uri: string;
  base64: string;
  mime: string;
}

interface RoleState {
  user: User | null;
  userAuthToken: string | null;
  languageSelect: string;
  selectedRole: Role;
  /**
   * Credentials captured at registration so we can silently obtain an auth
   * token (via /login) later in onboarding — the backend issues a token only
   * from /login, not register/verify-otp, and we don't want to force the
   * just-registered user through a separate sign-in screen.
   */
  pendingAuth: PendingAuth | null;
  /** The photo uploaded on CreateProfile, reused for the AR try-on overlay. */
  arPhoto: ArPhoto | null;
}

const initialState: RoleState = {
  user: null,
  userAuthToken: null,
  languageSelect: 'en',
  selectedRole: null,
  pendingAuth: null,
  arPhoto: null,
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setUserAuthToken: (state, action: PayloadAction<string | null>) => {
      state.userAuthToken = action.payload;
    },
    setPendingAuth: (state, action: PayloadAction<PendingAuth | null>) => {
      state.pendingAuth = action.payload;
    },
    setArPhoto: (state, action: PayloadAction<ArPhoto | null>) => {
      state.arPhoto = action.payload;
    },
    setLanguageSelect: (state, action: PayloadAction<string>) => {
      state.languageSelect = action.payload;
    },
    setRole: (state, action: PayloadAction<Role>) => {
      state.selectedRole = action.payload;
    },
    /**
     * Persist a full auth session (used after login/register/OTP verify).
     */
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.userAuthToken = action.payload.token;
    },
    /**
     * Clears the user/session (logout or account deletion).
     */
    removeUser: state => {
      state.user = null;
      state.userAuthToken = null;
    },
  },
});

export const {
  setUser,
  setUserAuthToken,
  setPendingAuth,
  setArPhoto,
  setLanguageSelect,
  setRole,
  setCredentials,
  removeUser,
} = roleSlice.actions;

export default roleSlice.reducer;
