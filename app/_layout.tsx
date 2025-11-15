// app/_layout.tsx
import { Colors } from "@/constants/theme";
import { AudioProvider } from "@/src/contexts/AudioContext";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { useAuth } from "@/src/hooks/useAuth";
import { Stack } from "expo-router";
import { ActivityIndicator, StatusBar, View } from "react-native";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.strongOrange }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  if (!user) {
    // Renderiza tu login como una pantalla “fuera del router”
    const LoginScreen = require("@/src/screens/LoginScreen").default;
    return <LoginScreen />;
  }
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AudioProvider>
        <StatusBar barStyle="light-content" />
        <AuthGate>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Tu grupo de tabs vive aquí */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* Player FUERA de las tabs */}
            <Stack.Screen name="player" options={{ headerShown: false, presentation: "card" }} />
          </Stack>
        </AuthGate>
      </AudioProvider>
    </AuthProvider>
  );
}
