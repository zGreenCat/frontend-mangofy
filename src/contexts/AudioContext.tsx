import { useAuth } from '@/src/hooks/useAuth';
import { getUploadSignature, saveAudioMeta, uploadToCloudinary } from "@/src/services/audioApi";
import { addToLibrary } from "@/src/services/libraryApi";
import { Audio, AVPlaybackStatusSuccess } from "expo-av";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { Alert } from "react-native";

type Quality = "128k" | "320k" | "preview" | string;

export interface Track {
  id: string;
  title?: string;
  artist?: string;
  quality?: Quality;
}

interface AudioContextValue {
  current: Track | null;
  queue: Track[];
  isPlaying: boolean;
  status: { positionMillis: number; durationMillis: number };
  loadById: (track: Track, opts?: { autoPlay?: boolean }) => Promise<void>;
  setQueue: (list: Track[], startIndex?: number) => Promise<void>;
  addToQueue: (t: Track) => void;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seek: (ms: number) => Promise<void>;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  uploadAndPlay: (file: { uri: string; name?: string; mimeType?: string }) => Promise<void>;
  setProgress?: (n: number) => void;
  progress?: number;
  uploadToLibrary: (file: { uri: string; name?: string; mimeType?: string }) => Promise<{ id: string; title: string }>;
}

export const AudioCtx = createContext<AudioContextValue | null>(null);

// cache simple de URLs firmadas
type CachedUrl = { url: string; exp: number };
const urlCache = new Map<string, CachedUrl>();
const base = "http://192.168.1.141:3001";
async function fetchPlayUrl(id: string, quality?: Quality, token?: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const cached = urlCache.get(id);
  if (cached && cached.exp - now > 30) return cached.url;

  const qs = quality ? `?quality=${encodeURIComponent(quality)}` : "";

  const res = await fetch(`${base}/api/audios/${id}/play${qs}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}, // ⬅️ usa el token
  });
  if (!res.ok) throw new Error(`GET /play fallo: ${res.status}`);
  const { url } = await res.json();
  urlCache.set(id, { url, exp: now + 3600 });
  return url;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const currentRef = useRef<Track | null>(null);
  const queueRef = useRef<Track[]>([]);
  const nextRef = useRef<() => Promise<void> | null>(null);

  const [current, setCurrent] = useState<Track | null>(null);
  const [queue, setQueueState] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState({ positionMillis: 0, durationMillis: 0 });
  const [progress, setProgress] = useState(0);
  const { accessToken, getAuthHeader  } = useAuth();
  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    }).catch(() => {});
  }, []);

  const unload = useCallback(async () => {
    if (soundRef.current) {
      try { await soundRef.current.unloadAsync(); } catch {}
      soundRef.current = null;
    }
  }, []);

  const onStatusUpdate = (s: AVPlaybackStatusSuccess) => {
    setStatus({
      positionMillis: s.positionMillis ?? 0,
      durationMillis: s.durationMillis ?? 0,
    });
    setIsPlaying(!!s.isPlaying);
    if (s.didJustFinish) {
      const fn = nextRef.current;
      if (fn) void fn();
    }
  };

  // --- define PRIMERO loadById ---
 const loadById = useCallback(
  async (track: Track, opts?: { autoPlay?: boolean }) => {
    const autoPlay = opts?.autoPlay ?? true;
    await unload();

    const url = await fetchPlayUrl(track.id, track.quality, accessToken ?? undefined); // ⬅️ pásalo
    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: !!autoPlay },
      (s) => { if (!s.isLoaded) return; onStatusUpdate(s as AVPlaybackStatusSuccess); }
    );

    soundRef.current = sound;
    currentRef.current = track;
    setCurrent(track);
  },
  [unload, onStatusUpdate, accessToken] // ⬅️ **incluye accessToken en deps**
);

  // ahora sí puedes referenciar loadById dentro de next/prev y uploadAndPlay
  const next = useCallback(async () => {
    const cur = currentRef.current;
    const q = queueRef.current;
    if (!cur || q.length === 0) return;
    const idx = q.findIndex((t) => t.id === cur.id);
    const nxt = q[idx + 1];
    if (nxt) await loadById(nxt, { autoPlay: true });
  }, [loadById]);

  const prev = useCallback(async () => {
    const cur = currentRef.current;
    const q = queueRef.current;
    if (!cur || q.length === 0) return;
    const idx = q.findIndex((t) => t.id === cur.id);
    const prv = q[idx - 1];
    if (prv) await loadById(prv, { autoPlay: true });
  }, [loadById]);

  const setQueue = useCallback(
    async (list: Track[], startIndex = 0) => {
      queueRef.current = list;
      setQueueState(list);
      if (list[startIndex]) await loadById(list[startIndex], { autoPlay: true });
    },
    [loadById]
  );

  const addToQueue = useCallback((t: Track) => {
    queueRef.current = [...queueRef.current, t];
    setQueueState((q) => [...q, t]);
  }, []);

  const play = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.playAsync();
    } catch {
      const cur = currentRef.current;
      if (cur) await loadById(cur, { autoPlay: true });
    }
  }, [loadById]);

  const pause = useCallback(async () => {
    if (!soundRef.current) return;
    await soundRef.current.pauseAsync();
  }, []);

  const seek = useCallback(async (ms: number) => {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(ms);
  }, []);

  // --- AHORA define uploadAndPlay (ya existe loadById) ---
  const uploadAndPlay = useCallback(
  async (file: { uri: string; name?: string; mimeType?: string }) => {
    try {
      if (!accessToken) throw new Error("No autenticado");

      const sig = await getUploadSignature(accessToken);
      const uploaded = await uploadToCloudinary({
        fileUri: file.uri,
        fileName: file.name ?? "audio.mp3",
        mimeType: file.mimeType ?? "audio/mpeg",
        sig,
        onProgress: (p) => setProgress(Math.min(99, Math.max(0, p))),
      });

      const title = (file.name ?? "Sin título").replace(/\.[^/.]+$/, "") || "Sin título";

      // 👇 LOG de lo que mandaremos (útil para depurar 400)
      console.log("[saveAudioMeta body]", {
        title,
        public_id: uploaded.public_id,
        format: uploaded.format,
        duration_sec: uploaded.duration,
        bytes: uploaded.bytes,
        visibility: "public",
      });

      const saved = await saveAudioMeta(
        {
          title,
          public_id: uploaded.public_id,
          format: uploaded.format ?? inferFormat(file.mimeType),
          duration_sec: Number(uploaded.duration) || undefined,
          bytes: typeof uploaded.bytes === "number" ? uploaded.bytes : undefined,
          visibility: "public",
        },
        accessToken
      );

      await loadById({ id: saved.id, title: saved.title }, { autoPlay: true });
      setProgress(0);
    } catch (err: any) {
      console.error("[uploadAndPlay] error:", err?.message, err);
      Alert.alert("Error al subir", err?.message ?? "Revisa la consola para más detalles.");
      throw err; // re-lanza si quieres manejarlo afuera también
    }
  },
  [accessToken, loadById]
);

  // sincroniza refs con estado
  useEffect(() => { currentRef.current = current; }, [current]);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { nextRef.current = next; }, [next]);

  useEffect(() => {
    return () => { void unload(); };
  }, [unload]);

const uploadToLibrary = useCallback(
  async (file: { uri: string; name?: string; mimeType?: string }) => {
    if (!accessToken) throw new Error("No autenticado");

    // 1) firma
    const sig = await getUploadSignature(accessToken);
    // 2) subir a Cloudinary
    const uploaded = await uploadToCloudinary({
      fileUri: file.uri,
      fileName: file.name ?? "audio.mp3",
      mimeType: file.mimeType ?? "audio/mpeg",
      sig,
      onProgress: (p) => setProgress(Math.min(99, Math.max(0, p))),
    });
    // 3) guardar metadatos
    const title = (file.name ?? "Sin título").replace(/\.[^/.]+$/, "") || "Sin título";
    const saved = await saveAudioMeta(
      {
        title,
        public_id: uploaded.public_id,
        format: uploaded.format ?? "mp3",
        duration_sec: Number(uploaded.duration) || undefined,
        bytes: typeof uploaded.bytes === "number" ? uploaded.bytes : undefined,
        visibility: "public",
      },
      accessToken
    );
    // 4) agregar a biblioteca del usuario
    await addToLibrary(saved.id, accessToken);

    setProgress(0);
    return saved; // por si quieres usarlo en UI
  },
  [accessToken]
  );



  
  const value: AudioContextValue = {
    current,
    queue,
    isPlaying,
    status,
    loadById,
    setQueue,
    addToQueue,
    play,
    pause,
    seek,
    next,
    prev,
    uploadAndPlay,
    setProgress,
    uploadToLibrary,
    progress,
     // opcional exponer progreso
  };

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

// helper para consumir el contexto (opcional)

function safeMsg(text: string) {
  try {
    const j = JSON.parse(text);
    if (j?.message) return j.message;
    if (j?.error) return j.error;
    if (Array.isArray(j?.issues) && j.issues.length) {
      // zod issues => concat mensajes
      return j.issues.map((i: any) => i.message || i.code || "").join(" | ");
    }
    return text?.slice(0, 300); // fallback
  } catch {
    return text?.slice(0, 300);
  }
}

function inferFormat(mime?: string) {
  if (!mime) return "mp3";
  if (mime.includes("mpeg")) return "mp3";
  if (mime.includes("x-m4a") || mime.endsWith("/mp4")) return "m4a";
  if (mime.endsWith("/wav")) return "wav";
  if (mime.endsWith("/aac")) return "aac";
  return "mp3";
}