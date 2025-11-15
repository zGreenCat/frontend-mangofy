// app/(tabs)/_layout.tsx
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.purple, borderTopColor: "#222" },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: "Buscar", tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="library"
        options={{ title: "Tu Biblioteca", tabBarIcon: ({ color, size }) => <Ionicons name="library" size={size} color={color} /> }}
      />
    </Tabs>
  );
}
