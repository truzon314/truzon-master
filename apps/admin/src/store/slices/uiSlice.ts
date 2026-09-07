import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface Modal {
  type: string | null;
  props: Record<string, any> | null;
}

interface UISliceState {
  sidebarOpen: boolean;
  toasts: Toast[];
  modals: Record<string, Modal>;
  loadingStates: Record<string, boolean>;
}

const initialState: UISliceState = {
  sidebarOpen: true,
  toasts: [],
  modals: {},
  loadingStates: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = Math.random().toString(36).substring(7);
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    openModal: (state, action: PayloadAction<{ key: string; type: string; props?: Record<string, any> }>) => {
      state.modals[action.payload.key] = { type: action.payload.type, props: action.payload.props || {} };
    },
    closeModal: (state, action: PayloadAction<string>) => {
      delete state.modals[action.payload];
    },
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loadingStates[action.payload.key] = action.payload.loading;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, addToast, removeToast, openModal, closeModal, setLoading } = uiSlice.actions;
export default uiSlice.reducer;