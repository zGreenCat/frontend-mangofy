// usa la misma env que el resto
const BASE = "http://192.168.1.141:3001";

export type UploadSignature = {
  timestamp: number;
  signature: string;
  cloudName: string;
  apiKey: string;
  upload_preset: string;
  folder: string;
};

export type SaveAudioBody = {
  title: string;
  artist?: string;
  public_id: string;
  format: string;
  duration_sec?: number;
  bytes?: number;
  visibility?: "public" | "private";
};

export async function getUploadSignature(accessToken: string) {
  const r = await fetch(`${BASE}/api/audios/upload/signature`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!r.ok) throw new Error(`signature ${r.status}`);
  return r.json();
}

export async function saveAudioMeta(
  body: {
    title: string;
    artist?: string;
    public_id: string;
    format: string;
    duration_sec?: number;
    bytes?: number;
    visibility?: "public" | "private";
  },
  accessToken: string // 👈 requerido
) {
  const r = await fetch(`${BASE}/api/audios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // 👈 AQUÍ
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`save ${r.status}`);
  return r.json() as Promise<{ id: string; title: string }>;
}

/** Subida a Cloudinary con progreso (XHR porque fetch no da progreso en RN) */
export function uploadToCloudinary(opts: {
  fileUri: string;
  fileName?: string;
  mimeType?: string;
  sig: UploadSignature;
  onProgress?: (pct: number) => void;
}): Promise<any> {
  const { fileUri, fileName = "audio.mp3", mimeType = "audio/mpeg", sig, onProgress } = opts;

  return new Promise((resolve, reject) => {
    const form = new FormData();
    // @ts-expect-error RN FormData
    form.append("file", { uri: fileUri, name: fileName, type: mimeType });
    form.append("api_key", sig.apiKey);
    form.append("timestamp", String(sig.timestamp));
    form.append("signature", sig.signature);
    form.append("upload_preset", sig.upload_preset);
    form.append("folder", sig.folder); // 👈 IMPORTANTE
    console.log("[sig]", sig);
    console.log("[upload URL]", `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`);
    const url = `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`; // audio => video

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const pct = Math.round((e.loaded / e.total) * 100);
        onProgress(Math.min(99, Math.max(0, pct)));
      }
    };
    xhr.onload = () => {
      const status = xhr.status;
      const text = xhr.responseText || "";
      // log crudo para depurar
      console.log("[Cloudinary upload status]", status);
      // intenta parsear JSON
      let body: any = null;
      try { body = JSON.parse(text); } catch { /* ignore */ }

      if (status >= 200 && status < 300) {
        console.log("[Cloudinary uploaded]", body);
        return resolve(body);
      }

      // Cloudinary suele devolver {error:{message:"..."}}
      const msg =
        (body?.error?.message as string) ||
        (typeof body === "string" ? body : "") ||
        text ||
        `HTTP ${status}`;
      console.warn("[Cloudinary upload ERROR]", status, msg);
      return reject(new Error(`cloudinary ${status}: ${msg}`));
    };
    xhr.onerror = () => {
      return reject(new Error("cloudinary network error"));
    };
    xhr.send(form);
  });
}