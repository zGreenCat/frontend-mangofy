import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from '../../constants/theme';

export default function RegisterForm({
    onSubmit,
    submitLabel = 'Crear cuenta',
    loading = false,
}:{
    onSubmit: (name:string,email:string,password:string) => void;
    submitLabel?: string;
    loading?: boolean;
}) {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirm,setConfirm] = useState('');


    
    function handlePress(){
        if (!name.trim() || !email.trim() || password.length < 6 || confirm.length < 6) {
            return;
        }
        if (password !== confirm){
            return
        }
        onSubmit(name.trim(),email.trim(),password);
    }
    const disabled = loading || !name.trim() || !email.trim() || password.length < 4 || password !== confirm;

    return (
         <View style={styles.container}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nombre"
        placeholderTextColor="#8a8a8a"
        style={styles.input}
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Correo electrónico"
        placeholderTextColor="#8a8a8a"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        placeholderTextColor="#8a8a8a"
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Confirmar contraseña"
        placeholderTextColor="#8a8a8a"
        secureTextEntry
        style={styles.input}
      />

      <View style={{ height: 12 }} />

      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        style={[styles.button, disabled && styles.buttonDisabled]}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={Colors.textDark} />
        ) : (
          <Text style={styles.buttonText}>{submitLabel}</Text>
        )}
      </TouchableOpacity>
    </View>
    )
}


const styles = StyleSheet.create({
  container: { width: '100%' },
  input: {
    height: 48,
    borderRadius: 999,
    paddingHorizontal: 16,
    backgroundColor: Colors.inputBg,
    color: Colors.textDark,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,179,102,0.18)',
  },
  button: {
    height: 48,
    borderRadius: 999,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.textDark,
    fontWeight: '700',
    fontSize: 16,
  },
});