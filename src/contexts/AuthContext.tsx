import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { storage } from '@/utils/storage';
import type { LoginForm, User } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (form: LoginForm) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = storage.getUser();
    const token = storage.getToken();
    if (storedUser && token) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (form: LoginForm) => {
    const resp = await authApi.login(form);
    storage.setToken(resp.token);
    // 登录成功后获取当前用户信息
    const userInfo = await authApi.getUser();
    storage.setUser(userInfo);
    setUser(userInfo);
    navigate('/', { replace: true });
  };

  const logout = () => {
    storage.clear();
    setUser(null);
    navigate('/login');
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user && !!storage.getToken(),
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
