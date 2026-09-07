import '@testing-library/jest-native';
import 'react-native-gesture-handler/jestSetup';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Stack: ({ children }) => children,
  Link: ({ children, ...props }) => <View {...props}>{children}</View>,
}));

jest.mock('@/store/authStore', () => ({
  useAuthStore: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    roleType: 'customer',
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    checkAuth: jest.fn(),
  }),
}));

jest.mock('@/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

global.__DEV__ = true;