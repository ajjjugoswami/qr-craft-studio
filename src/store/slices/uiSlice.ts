import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============ Types ============
interface UIState {
  sidebarCollapsed: boolean;
  dashboardViewMode: 'list' | 'grid';
}

const initialState: UIState = {
  sidebarCollapsed: false,
  dashboardViewMode: 'grid',
};

// ============ Slice ============
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setDashboardViewMode: (state, action: PayloadAction<'list' | 'grid'>) => {
      state.dashboardViewMode = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed, setDashboardViewMode } = uiSlice.actions;

// ============ Selectors ============
export const selectSidebarCollapsed = (state: { ui: UIState }) => state.ui.sidebarCollapsed;
export const selectDashboardViewMode = (state: { ui: UIState }) => state.ui.dashboardViewMode;

export default uiSlice.reducer;
