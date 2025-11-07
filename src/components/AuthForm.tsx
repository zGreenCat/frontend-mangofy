import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
export default function AuthForm({
  onSubmit,
  submitLabel = 'Entrar',
  loading = false,
}: {
  onSubmit: (email: string, password: string) => void;
  submitLabel?: string;
  loading?: boolean;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handlePress() {
    onSubmit(email.trim(), password);
  }

  const disabled = loading || !email.trim() || !password;

  return (
    <View style={styles.container}>
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

      <View style={{ height: 12 }} />

      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        style={[styles.button, disabled && styles.buttonDisabled]}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>{submitLabel}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
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
    borderColor: 'rgba(255,179,102,0.25)',
  },
  button: {
    height: 48,
    borderRadius: 999,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: Colors.textDark, fontWeight: '700', fontSize: 16 },
});