// src/components/FABUpload.tsx
import { useAudio } from "@/src/hooks/useAudio";
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function FABUpload() {
  const { uploadToLibrary } = useAudio();
  const [loading, setLoading] = React.useState(false);

  const onPress = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await DocumentPicker.getDocumentAsync({
        type: ["audio/mpeg","audio/mp4","audio/x-m4a","audio/wav","audio/aac"],
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (res.canceled) return;
      const f = res.assets[0];
      await uploadToLibrary({ uri: f.uri, name: f.name, mimeType: f.mimeType });
      Alert.alert("Agregado", "El audio se subió y quedó en tu biblioteca.");
    } catch (e:any) {
      console.error(e);
      Alert.alert("Error", e?.message ?? "No se pudo agregar.");
    } finally {
      setLoading(false);
    }
  }, [uploadToLibrary]);

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Pressable style={[styles.fab, loading && styles.fabDisabled]} onPress={onPress} disabled={loading}>
        <Text style={styles.plus}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", right: 16, bottom: 24 },
  fab: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#7C3AED", alignItems: "center", justifyContent: "center",
    elevation: 6, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  fabDisabled: { opacity: 0.6 },
  plus: { color: "white", fontSize: 28, marginTop: -2 },
});
