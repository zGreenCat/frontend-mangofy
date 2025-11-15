// src/screens/LibraryScreen.tsx (ejemplo simple)
import { useAudio } from "@/src/hooks/useAudio";
import { useAuth } from "@/src/hooks/useAuth";
import { listMyLibrary, removeFromLibrary } from "@/src/services/libraryApi";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FABUpload from '../components/FABUpload';


export default function LibraryScreen() {
  const { accessToken } = useAuth() as any;
  const { loadById } = useAudio();
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    const data = await listMyLibrary(accessToken);
    setItems(data);
    setLoading(false);
  }, [accessToken]);

  React.useEffect(() => { load(); }, [load]);

  return (
    <SafeAreaView style={{ flex:1, padding:16 }}>
      {loading ? <Text>Cargando…</Text> : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.audioId}
          renderItem={({ item }) => (
            <View style={{ paddingVertical:12, borderBottomWidth: 0.5, borderColor: "#333" }}>
              <Text style={{ fontWeight: "700" }}>{item.audio?.title ?? item.audioId}</Text>
              <View style={{ flexDirection: "row", gap: 12, marginTop: 6 }}>
                <Pressable onPress={() => loadById({ id: item.audioId, title: item.audio?.title }, { autoPlay: true })}>
                  <Text style={{ color: "#7C3AED" }}>Reproducir</Text>
                </Pressable>
                <Pressable onPress={async () => { await removeFromLibrary(item.audioId, accessToken!); await load(); }}>
                  <Text style={{ color: "#ef4444" }}>Quitar</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
      <FABUpload />
    </SafeAreaView>
  );
}
