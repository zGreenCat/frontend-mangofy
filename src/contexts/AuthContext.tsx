import { api, clearSession, getAccessToken, initAuth, setSession } from '@/src/services/authApi';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useEffect, useState } from 'react';

type User = { id: string; name: string; email: string } | null;
type AuthContextValue = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  accessToken: string | null; 
  getAuthHeader: () => { Authorization: string } | {};
};



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
  const [accessToken, setAccessToken] = useState<string | null>(null);

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
          // tras initAuth, lee el access vigente desde tu servicio
          const t = getAccessToken?.() || null;
          if (mounted) setAccessToken(t);
        } catch (e) {
          console.warn('[Auth] initAuth failed or timed out:', (e as Error).message);
          await SecureStore.deleteItemAsync('refreshToken').catch(() => {});
          if (mounted) setAccessToken(null);
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
      setAccessToken('mock-token'); // opcional
      return mock;
    }

    const { data } = await api.post('/api/auth/login', { email, password });
    await setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    setAccessToken(data.accessToken);                 
    setUser(data.user ?? null);
    return data.user ?? null;
  }

  async function register(name: string, email: string, password: string) {
    if (USE_MOCK_AUTH) {
      await new Promise((r) => setTimeout(r, 800));
      const mock = { id: 'u' + Date.now(), name, email };
      await SecureStore.setItemAsync(MOCK_USER_KEY, JSON.stringify(mock));
      setUser(mock);
      setAccessToken('mock-token'); // opcional
      return mock;
    }

    const { data } = await api.post('/api/auth/register', { email, password, name });
    await setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    setAccessToken(data.accessToken);                
    setUser(data.user ?? null);
    return data.user ?? null;
  }

  async function logout() {
    if (USE_MOCK_AUTH) {
      await SecureStore.deleteItemAsync(MOCK_USER_KEY);
      setUser(null);
      setAccessToken(null);                           // 👈 limpia token
      return;
    }
    try {
      await clearSession();
    } finally {
      setUser(null);
      setAccessToken(null);                           // 👈 limpia token
    }
  }
  function getAuthHeader() {
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  }
  return (
     <AuthContext.Provider value={{ user, loading, accessToken, login, register, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);