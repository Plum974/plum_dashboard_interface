import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector = useSelector<RootState>;