import { api, clearSession, initAuth, setSession } from '@/src/services/api';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = { id: string; name: string; email: string } | null;
type AuthContextValue = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Si quieres mock rápido, cambia a true
const USE_MOCK_AUTH = false;
const MOCK_USER_KEY = 'mockUser';

function withTimeout<T>(p: Promise<T>, ms = 7000): Promise<T> {
  const timeout = new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
  return Promise.race([p, timeout]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (USE_MOCK_AUTH) {
          const raw = await SecureStore.getItemAsync(MOCK_USER_KEY);
          if (raw && mounted) setUser(JSON.parse(raw));
          return;
        }

        // initAuth puede hacer refresh; lo envolvemos con timeout para evitar bloqueos
        try {
          await withTimeout(initAuth(), 7000);
        } catch (e) {
          console.warn('[Auth] initAuth failed or timed out:', (e as Error).message);
          // si falla, intentar leer refreshToken localmente y borrarlo para evitar loops
          await SecureStore.deleteItemAsync('refreshToken').catch(() => {});
        }

        // Si tienes endpoint /me puedes obtener perfil aquí. Ejemplo:
        try {
          const res = await api.get('/auth/me').catch(() => null);
          if (res && res.data && mounted) {
            setUser(res.data.user ?? null);
          }
        } catch (err) {
          console.warn('[Auth] /auth/me failed', err);
        }
      } catch (err) {
        console.error('[Auth] init error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function login(email: string, password: string) {
    if (USE_MOCK_AUTH) {
      await new Promise((r) => setTimeout(r, 600));
      const mock = { id: 'u1', name: 'Usuario Mock', email };
      await SecureStore.setItemAsync(MOCK_USER_KEY, JSON.stringify(mock));
      setUser(mock);
      return mock;
    }

    const { data } = await api.post('/auth/login', { email, password });
    await setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    setUser(data.user ?? null);
    return data.user ?? null;
  }

  async function register(name: string, email: string, password: string) {
    if (USE_MOCK_AUTH) {
      await new Promise((r) => setTimeout(r, 800));
      const mock = { id: 'u' + Date.now(), name, email };
      await SecureStore.setItemAsync(MOCK_USER_KEY, JSON.stringify(mock));
      setUser(mock);
      return mock;
    }

    const { data } = await api.post('/auth/register', { email, password, name });
    await setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    setUser(data.user ?? null);
    return data.user ?? null;
  }

  async function logout() {
    if (USE_MOCK_AUTH) {
      await SecureStore.deleteItemAsync(MOCK_USER_KEY);
      setUser(null);
      return;
    }
    try {
      await clearSession();
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}