import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

/** Typed `useDispatch` — use this throughout the app instead of plain `useDispatch`. */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** Typed `useSelector` — use this throughout the app instead of plain `useSelector`. */
export const useAppSelector = useSelector.withTypes<RootState>();
