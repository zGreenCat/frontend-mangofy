import { default as index, default as library, default as search } from "@/app/(tabs)";
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from "react-native-safe-area-context";
const Tab = createBottomTabNavigator();

export default function RootLayout() {

  return (
    <SafeAreaProvider >
      <StatusBar barStyle="light-content" />  
      <Tab.Navigator 
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#121212', borderTopColor: "#222" },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#b3b3b3',
      }}>
        <Tab.Screen name="Home" component={index} options={{tabBarIcon: ({color,size}) => <Ionicons name="home" size= {size} color={color} />,}}/>
        <Tab.Screen name="Buscar" component={search} />
        <Tab.Screen name="Tu Biblioteca" options={{title: 'Tu Biblioteca'}} component={library} />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
}
