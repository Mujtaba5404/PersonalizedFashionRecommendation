import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LoaderStatus = 'idle' | 'loading';

interface ScreenState {
  /** Global network loader status, driven by the axios interceptors. */
  status: LoaderStatus;
  /** Name of the currently active screen (for analytics / conditional UI). */
  activeScreen: string | null;
  /** Whether the user has completed onboarding. */
  onboarded: boolean;
}

const initialState: ScreenState = {
  status: 'idle',
  activeScreen: null,
  onboarded: false,
};

const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    /** Show the global loader. Payload is the status string (e.g. 'loading'). */
    showLoader: (state, action: PayloadAction<LoaderStatus>) => {
      state.status = action.payload;
    },
    /** Hide the global loader. Payload is the status string (e.g. 'idle'). */
    hideLoader: (state, action: PayloadAction<LoaderStatus>) => {
      state.status = action.payload;
    },
    setActiveScreen: (state, action: PayloadAction<string | null>) => {
      state.activeScreen = action.payload;
    },
    setOnboarded: (state, action: PayloadAction<boolean>) => {
      state.onboarded = action.payload;
    },
  },
});

export const { showLoader, hideLoader, setActiveScreen, setOnboarded } =
  screenSlice.actions;

export default screenSlice.reducer;
