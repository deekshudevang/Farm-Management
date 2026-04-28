import { useAuthStore } from '../store/authStore';

/**
 * Migration shim to keep current components working while 
 * transitioning to Zustand for state management.
 */
export const useAuth = () => {
  const { user, token, login, logout } = useAuthStore();
  return { user, token, login, logout, isAuthenticated: !!token };
};

// Placeholder for AuthProvider to prevent build breaks in App.tsx
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
