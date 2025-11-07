import { default as index, default as library, default as search } from "@/app/(tabs)";
import LoginScreen from "@/src/screens/LoginScreen";
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

const Tab = createBottomTabNavigator();

function AuthGate() {
  const {user, loading} = useAuth();

  if(loading) {
    return (
      <View style= {{flex:1,alignItems: 'center', justifyContent: 'center', backgroundColor: '#000'}}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    )
  }
  if(!user) {return <LoginScreen />}

  return (
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
  )
}



export default function RootLayout() {

  return (
    <AuthProvider >
      <StatusBar barStyle="light-content" />  
      <AuthGate />
    </AuthProvider>
  );
}
