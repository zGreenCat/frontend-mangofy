// src/components/UploadAudio.tsx
import { useAudio } from "@/src/hooks/useAudio";
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import { Alert, Button, Text, View } from "react-native";

export default function UploadAudio() {
  const { uploadAndPlay, progress } = useAudio();
  const [localLoading, setLocalLoading] = React.useState(false);

  const pickAndUpload = React.useCallback(async () => {
    try {
      setLocalLoading(true);

      const res = await DocumentPicker.getDocumentAsync({
        type: ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/wav", "audio/aac"],
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (res.canceled) return;

      const f = res.assets[0]; // { uri, name, size, mimeType }
      await uploadAndPlay({ uri: f.uri, name: f.name, mimeType: f.mimeType });

      Alert.alert("Listo", "Audio subido y reproduciéndose.");
    } catch (e: any) {
      console.error(e);
      Alert.alert("Error", e?.message ?? "No se pudo subir el audio.");
    } finally {
      setLocalLoading(false);
    }
  }, [uploadAndPlay]);

  return (
    <View>
      <Button title={localLoading ? "Subiendo..." : "Subir audio"} onPress={pickAndUpload} disabled={localLoading} />
      {/* Si expusiste progress en el provider, descomenta: */}
    {typeof progress === "number" && progress > 0 && <Text>Subiendo… {progress}%</Text>}
    </View>
  );
}
