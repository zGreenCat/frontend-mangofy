// src/navigation/Tabs.tsx
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ExploreScreen from '@/app/(tabs)/explore';
import HomeScreen from '@/app/(tabs)/index';
import LibraryScreen from '@/app/(tabs)/library';

const Tab = createBottomTabNavigator();

export default function TabsNav() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.purple, borderTopColor: '#222' },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#fff',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Buscar"
        component={ExploreScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Tu Biblioteca"
        component={LibraryScreen}
        options={{ title: 'Tu Biblioteca', tabBarIcon: ({ color, size }) => <Ionicons name="library" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}
