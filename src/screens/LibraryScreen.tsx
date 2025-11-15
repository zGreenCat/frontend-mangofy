// src/screens/LibraryScreen.tsx
import { useAudio } from "@/src/hooks/useAudio";
import { useAuth } from "@/src/hooks/useAuth";
import { listMyLibrary, removeFromLibrary } from "@/src/services/libraryApi";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FABUpload from "../components/FABUpload";

type LibItem = {
  audioId: string;
  createdAt?: string;
  audio?: { id: string; title?: string; artist?: string };
};

export default function LibraryScreen() {
  const router = useRouter();
  const { accessToken } = useAuth() as any;
  const { setQueue, loadById } = useAudio();

  const [items, setItems] = React.useState<LibItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const data = await listMyLibrary(accessToken);
      // opcional: ordenar por fecha desc si el backend no lo hace
      data.sort?.((a: LibItem, b: LibItem) =>
        (b.createdAt || "").localeCompare(a.createdAt || "")
      );
      setItems(data);
    } catch (e) {
      console.warn("[Library] list failed:", e);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = React.useCallback(async () => {
    if (!accessToken) return;
    setRefreshing(true);
    try { await fetchData(); } finally { setRefreshing(false); }
  }, [accessToken, fetchData]);

  const keyExtractor = React.useCallback((it: LibItem) => it.audioId, []);

  // Reproducir toda la lista desde el índice tocado
  const playFromIndex = React.useCallback(
    async (index: number) => {
      const queue = items.map((it) => ({
        id: it.audioId,
        title: it.audio?.title ?? "Sin título",
        artist: it.audio?.artist ?? "Desconocido",
      }));
      if (!queue.length) return;
      await setQueue(queue, index);
      router.push("/player");
    },
    [items, setQueue, router]
  );

  const removeItem = React.useCallback(
    async (audioId: string) => {
      // optimista
      const prev = items;
      setItems((arr) => arr.filter((x) => x.audioId !== audioId));
      try {
        await removeFromLibrary(audioId, accessToken!);
      } catch (e) {
        console.warn("[Library] remove failed:", e);
        setItems(prev);
        Alert.alert("Error", "No se pudo quitar de tu biblioteca.");
      }
    },
    [items, accessToken]
  );

  const Empty = (
    <View style={{ paddingTop: 48, alignItems: "center" }}>
      <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 6 }}>Tu biblioteca está vacía</Text>
      <Text style={{ opacity: 0.7, textAlign: "center" }}>
        Sube canciones con el botón “+” o agrégalas desde otras vistas.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
      {loading ? (
        <View style={{ paddingTop: 24 }}>
          <Text>Cargando…</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={Empty}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item, index }) => (
            <View
              style={{
                paddingVertical: 12,
                borderBottomWidth: 0.5,
                borderColor: "#e5e7eb",
              }}
            >
              <Text style={{ fontWeight: "700" }}>
                {item.audio?.title ?? item.audioId}
              </Text>
              {item.audio?.artist ? (
                <Text style={{ opacity: 0.7, marginTop: 2 }}>{item.audio.artist}</Text>
              ) : null}

              <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
                <Pressable onPress={() => playFromIndex(index)}>
                  <Text style={{ color: "#7C3AED", fontWeight: "600" }}>Reproducir</Text>
                </Pressable>

                <Pressable onPress={() => removeItem(item.audioId)}>
                  <Text style={{ color: "#ef4444", fontWeight: "600" }}>Quitar</Text>
                </Pressable>

                {/* Reproducir solo este (sin setQueue) si lo prefieres */}
                {/* <Pressable onPress={async () => {
                  await loadById({ id: item.audioId, title: item.audio?.title }, { autoPlay: true });
                  router.push("/(player)/PlayerScreen");
                }}>
                  <Text style={{ color: "#111827" }}>Solo este</Text>
                </Pressable> */}
              </View>
            </View>
          )}
        />
      )}

      <FABUpload />
    </SafeAreaView>
  );
}
