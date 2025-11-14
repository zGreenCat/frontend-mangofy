
import LoginScreen from "@/src/screens/LoginScreen";
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import 'react-native-reanimated';
import { Colors } from "../constants/theme";
import { AuthProvider } from '../src/contexts/AuthContext';
import { useAuth } from '../src/hooks/useAuth';

import ExploreScreen from '@/app/(tabs)/explore';
import HomeScreen from '@/app/(tabs)/index';
import LibraryScreen from '@/app/(tabs)/library';
import { AudioProvider } from '../src/contexts/AudioContext';
const Tab = createBottomTabNavigator();

function AuthGate() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.strongOrange }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    )
  }
  if(!user) {return <LoginScreen />}

  return (
    <Tab.Navigator 
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.purple, borderTopColor: "#222" },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#fff',
      }}>
    
        
        <Tab.Screen name="Home"  component={HomeScreen} options={{tabBarIcon: ({color,size}) => <Ionicons name="home" size= {size} color={color} />,}}/>
        <Tab.Screen name="Buscar" component={ExploreScreen} options={{tabBarIcon: ({color,size}) => <Ionicons name="search" size={size} color={color} />,}} />
        <Tab.Screen name="Tu Biblioteca" options={{title: 'Tu Biblioteca', tabBarIcon: ({color,size}) => <Ionicons name="library" size={size} color={color} />,}} component={LibraryScreen} />
      </Tab.Navigator>
  )
}



export default function RootLayout() {

  return (
    <AuthProvider >
      <AudioProvider>
      <StatusBar barStyle="light-content" />  
      <AuthGate />
      </AudioProvider>
    </AuthProvider>
  );
}
