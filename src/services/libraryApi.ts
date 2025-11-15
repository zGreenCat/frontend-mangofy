const BASE = "http://192.168.1.141:3001";

export async function addToLibrary(audioId: string, accessToken: string) {
  const r = await fetch(`${BASE}/api/library`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ audioId }),
  });
  if (!r.ok) {
    const t = await r.text();
    console.warn("[addToLibrary] HTTP", r.status, t);
    throw new Error(`addToLibrary ${r.status}`);
  }
  return r.json();
}

export async function listMyLibrary(accessToken: string) {
  const r = await fetch(`${BASE}/api/library`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!r.ok) throw new Error(`listMyLibrary ${r.status}`);
  return r.json() as Promise<Array<{ audioId: string; addedAt: string; audio: any }>>;
}

export async function removeFromLibrary(audioId: string, accessToken: string) {
  const r = await fetch(`${BASE}/api/library/${audioId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!r.ok) throw new Error(`removeFromLibrary ${r.status}`);
}
