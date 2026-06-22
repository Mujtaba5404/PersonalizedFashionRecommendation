import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import { mmkvStorage } from './mmkvAdaptar';
import roleReducer from './slice/roleSlice';
import screenReducer from './slice/screenSlice';

/**
 * Persist the `role` slice (auth token, user, language, role) and the
 * onboarding flag from `screen`. The transient loader status is NOT persisted.
 */
const rolePersistConfig = {
  key: 'role',
  storage: mmkvStorage,
};

const screenPersistConfig = {
  key: 'screen',
  storage: mmkvStorage,
  whitelist: ['onboarded'],
};

const rootReducer = combineReducers({
  role: persistReducer(rolePersistConfig, roleReducer),
  screen: persistReducer(screenPersistConfig, screenReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist dispatches these non-serializable actions.
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
