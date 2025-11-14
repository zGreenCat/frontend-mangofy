import { View } from "react-native";
import { ThemedText } from "../components/themed-text";
import UploadAudio from '../components/UploadAudio';

export default function LibraryScreen() { 
    return (
        <View>
            <ThemedText type="title">Tu Biblioteca</ThemedText>
            <UploadAudio />
        </View>
    );
}
