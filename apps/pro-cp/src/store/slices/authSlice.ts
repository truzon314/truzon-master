import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserRole {
  id: string;
  name: string;
  displayName: string;
  permissions?: Array<{ key: string }>;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  cpId?: string; // Channel partner organization ID if CP user
  cpName?: string;
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

// Default mock user for development and demo: Pro Sales Executive
export const DEFAULT_PRO_USER: User = {
  id: 'usr-pro-01',
  email: 'agent@truzon.in',
  fullName: 'Arjun Verma',
  phone: '+91 98765 11223',
  role: {
    id: 'role-pro',
    name: 'SALES_AGENT',
    displayName: 'Senior Sales Executive',
  },
  status: 'ACTIVE',
  emailVerified: true,
  phoneVerified: true,
};

// Default mock user for development and demo: Channel Partner Broker
export const DEFAULT_CP_USER: User = {
  id: 'usr-cp-01',
  email: 'partner@squareyards.com',
  fullName: 'Rajesh Nair',
  phone: '+91 98200 44556',
  cpId: 'cp-001',
  cpName: 'Square Yards Global',
  role: {
    id: 'role-cp',
    name: 'CHANNEL_PARTNER',
    displayName: 'Authorized Channel Partner',
  },
  status: 'ACTIVE',
  emailVerified: true,
  phoneVerified: true,
};

const initialState: AuthState = {
  user: DEFAULT_PRO_USER,
  isAuthenticated: true,
  isLoading: false,
  accessToken: 'mock-pro-dev-token',
  refreshToken: 'mock-pro-dev-refresh',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      if (typeof window !== 'undefined') {
        localStorage.setItem('pro_cp_user', JSON.stringify(action.payload.user));
        localStorage.setItem('pro_cp_token', action.payload.accessToken);
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      if (typeof window !== 'undefined') {
        localStorage.setItem('pro_cp_user', JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoading = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pro_cp_user');
        localStorage.removeItem('pro_cp_token');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof window !== 'undefined') {
          localStorage.setItem('pro_cp_user', JSON.stringify(state.user));
        }
      }
    },
  },
});

export const { setCredentials, setUser, logout, setLoading, updateUser } = authSlice.actions;
export default authSlice.reducer;