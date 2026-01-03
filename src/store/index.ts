import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import qrCodesReducer from './slices/qrCodesSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import analyticsReducer from './slices/analyticsSlice';
import contactsReducer from './slices/contactsSlice';
import qrAnalyticsReducer from './slices/qrAnalyticsSlice';
import statsReducer from './slices/statsSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    qrCodes: qrCodesReducer,
    auth: authReducer,
    ui: uiReducer,
    analytics: analyticsReducer,
    contacts: contactsReducer,
    qrAnalytics: qrAnalyticsReducer,
    stats: statsReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for use throughout the app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
