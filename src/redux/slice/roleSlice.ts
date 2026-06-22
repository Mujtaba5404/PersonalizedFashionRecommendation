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

interface RoleState {
  user: User | null;
  userAuthToken: string | null;
  languageSelect: string;
  selectedRole: Role;
}

const initialState: RoleState = {
  user: null,
  userAuthToken: null,
  languageSelect: 'en',
  selectedRole: null,
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
  setLanguageSelect,
  setRole,
  setCredentials,
  removeUser,
} = roleSlice.actions;

export default roleSlice.reducer;
