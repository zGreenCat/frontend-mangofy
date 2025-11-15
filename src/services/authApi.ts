import axios, { AxiosError, AxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "http://192.168.1.141:3001"; // <- en dispositivo real/Expo Go usa 192.168.x.y o 10.0.2.2 para emulador Android

let accessToken: string | null = null;
type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

export async function initAuth() {
  const rt = await SecureStore.getItemAsync("refreshToken");
  if (!rt) return;
  try {
    const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken: rt });
    accessToken = data.accessToken;
    await SecureStore.setItemAsync("refreshToken", data.refreshToken);
  } catch {
    await SecureStore.deleteItemAsync("refreshToken");
    accessToken = null;
  }
}

export async function setSession(tokens: { accessToken: string; refreshToken: string }) {
  accessToken = tokens.accessToken;
  await SecureStore.setItemAsync("refreshToken", tokens.refreshToken);
}

export async function clearSession() {
  const rt = await SecureStore.getItemAsync("refreshToken");
  if (rt) {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, { refreshToken: rt });
    } catch {}
  }
  await SecureStore.deleteItemAsync("refreshToken");
  accessToken = null;
}

export const api = axios.create({ baseURL: API_URL });

// helper para headers (AxiosHeaders o plain object)
function setAuthorizationHeader(headers: any, token: string | null) {
  if (!token) return headers ?? {};
  if (headers && typeof headers.set === "function") {
    headers.set("Authorization", `Bearer ${token}`);
    return headers;
  }
  return { ...(headers ?? {}), Authorization: `Bearer ${token}` };
}

// Request interceptor (solo uno)
api.interceptors.request.use((config) => {
  if (!config) return config;
  // No adjuntar token a llamadas de auth (login/refresh/register)
  const url = config.url ?? "";
  if (url.includes("/api/auth/refresh") || url.includes("/api/auth/login") || url.includes("/api/auth/register")) {
    return config;
  }
  if (accessToken) {
    config.headers = setAuthorizationHeader(config.headers, accessToken) as any;
  }
  return config;
});

let refreshing: Promise<void> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error: unknown) => {
    const axiosError = error as AxiosError;
    const original = (axiosError.config || {}) as RetriableConfig | undefined;

    // si no es 401 o no hay config, re-lanzar
    if (axiosError.response?.status !== 401 || !original) {
      throw axiosError;
    }

    // evitar reintentos infinitos
    if (original._retry) {
      throw axiosError;
    }
    original._retry = true;

    // si ya hay un refresh en curso, esperar
    if (!refreshing) {
      refreshing = (async () => {
        const rt = await SecureStore.getItemAsync("refreshToken");
        if (!rt) throw axiosError;
        const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken: rt });
        accessToken = data.accessToken;
        await SecureStore.setItemAsync("refreshToken", data.refreshToken);
      })().finally(() => {
        refreshing = null;
      });
    }

    try {
      await refreshing;
      // aseguro header antes de reintentar
      original.headers = setAuthorizationHeader(original.headers, accessToken) as any;
      return api.request(original);
    } catch (err) {
      // si falla refresh limpiar sesión y re-lanzar
      await SecureStore.deleteItemAsync("refreshToken");
      accessToken = null;
      throw err;
    }
  }
);
export function getAccessToken() {
  return accessToken; // devuelve el valor en memoria que está usando axios
}