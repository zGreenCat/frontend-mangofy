import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../constants/theme';
import AuthForm from '../components/AuthForm';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from "../contexts/AuthContext";
export default function LoginScreen() {
    const { login, register} = useAuth();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loading, setLoading] = useState(false);
    const { width: SCREEN_WIDTH } = Dimensions.get('window');

     const anim = useRef(new Animated.Value(mode === 'login' ? 0 : 1)).current;
    useEffect(() => {
      Animated.timing(anim, {
        toValue: mode === 'login' ? 0 : 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, [mode, anim]);

    const loginStyle = {
      opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }) }],
    };
    const registerStyle = {
      opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
    };
    async function handleLogin(email: string, password: string) {
        setLoading(true);
        try{
            await login(email, password);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    async function handleRegister(name: string, email: string, password: string) {
        setLoading(true);
        try{
            await register(name, email, password);
            setMode('login');
            
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    function toggleMode() {
        setMode((prevMode) => (prevMode === 'login' ? 'register' : 'login'));
    }
  return (
  <SafeAreaView style={[styles.container, { backgroundColor: Colors.beige }]}>
   <Svg
        width={SCREEN_WIDTH * 1.8}
        height={SCREEN_WIDTH * 1.8}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={[styles.bgSvg, { left: -(SCREEN_WIDTH * 0.4), top: -(SCREEN_WIDTH * 0.6) }]}
      >
        <Circle cx="50" cy="50" r="50" fill={Colors.green} opacity={0.14} />
      </Svg>
    <View style={styles.header}>
        <Image source={require('../../assets/images/mango.png')} style={styles.logo} />
        <Text style={styles.title}>MangoFy</Text>
    </View>
      
         <View style={[styles.container2, mode === 'register' && styles.container2Register]}>
         {/* formWrapper ahora cambia su minHeight según el modo */}
         <View style={[styles.formWrapper, mode === 'register' ? styles.formWrapperRegister : styles.formWrapperLogin]}>
         <Animated.View
            pointerEvents={mode === 'login' ? 'auto' : 'none'}
            style={[styles.form, loginStyle, styles.absoluteLayer]}
          >
            <AuthForm onSubmit={handleLogin} submitLabel="Entrar" loading={loading} />
          </Animated.View>

          <Animated.View
            pointerEvents={mode === 'register' ? 'auto' : 'none'}
            style={[styles.form, registerStyle, styles.absoluteLayer]}
          >
            <RegisterForm onSubmit={handleRegister} submitLabel="Crear cuenta" loading={loading} />
          </Animated.View>
        </View>

        <TouchableOpacity onPress={() => setMode((m) => (m === 'login' ? 'register' : 'login'))} style={styles.toggleBtn}>
          <Text style={styles.toggleText}>{mode === 'login' ? 'Registrarse' : 'Iniciar sesión'}</Text>
        </TouchableOpacity>
    </View>
           
        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 24, justifyContent: 'center' },
     header: {
    width: '100%',
    alignItems: 'center',      // centra el logo y el texto horizontalmente
    justifyContent: 'center',
    marginBottom: 40,         // aumenta separación entre título y tarjeta
    paddingTop: 6,
    zIndex: 3,
  },
    logo: {
    width: 52,
    height: 52,
    marginBottom: 6,          // logo encima del texto con pequeño espacio
    borderRadius: 8,
  },
      title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.red,
    textAlign: 'center',
    lineHeight: 36,
  },

  // tarjeta ajustada al contenido
     container2: {
    borderRadius: 16,
    alignSelf: 'center',
    width: '86%',
    maxWidth: 420,
    backgroundColor: Colors.beige,
    paddingVertical: 26,
    paddingHorizontal: 18,
    alignItems: 'center',
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,179,102,0.25)',
    zIndex: 2,
  },
  form: { width: '100%' },

  toggleBtn: {
    marginTop: 18,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.orange,
    zIndex: 4, // evitar que quede por debajo de capas absolutas
  },
  toggleText: { color: Colors.orange, fontSize: 16, fontWeight: '700' },

  // círculo decorativo
   bgCircle: {
    position: 'absolute',
    width: 600,              // tamaño grande para formar un arco suave
    height: 600,
    borderRadius: 300,
    backgroundColor: Colors.green, // usa el verde de tu paleta
           // baja opacidad para que no compita
    right: -180,            // mueve hacia la derecha (ajusta para tu layout)
    top: -340,              // negativo para que solo se vea la parte inferior del círculo
    zIndex: 0,
  },
   bgSvg: {
    position: 'absolute',
    zIndex: 0,
  },
  formWrapper: {
    width: '100%',
    justifyContent: 'center',
  },
  formWrapperLogin: {
    minHeight: 220, // menos espacio para login (ajusta si hace falta)
  },
  formWrapperRegister: {
    minHeight: 380, // más espacio para register (evita solapamientos)
  },

   absoluteLayer: {
    position: 'absolute',
    width: '100%',
    left: 0,
    top: 0,
    zIndex: 1,
  },
  container2Register: {
    paddingBottom: 48,
  },
});


