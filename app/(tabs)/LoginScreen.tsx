import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { supabase } from '../../supabase';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      Alert.alert('Erro de Login', error.message);
    } else {
      router.replace('/home');
    }
  }

  return (
    <View style={styles.pageContainer}>
      <Image
        source={{ uri: 'https://disciplinas.uvv.br/assets/images/uvv-brasao.png' }} 
        style={styles.image}
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholderTextColor="#A1A1A3"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        secureTextEntry
        placeholderTextColor="#A1A1A3"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/RegisterScreen')}>
        <Text style={styles.link}>Criar Conta</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/ForgotPasswordScreen')}>
        <Text style={styles.link}>Esqueci minha senha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#9B5DE5',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '85%',
    height: 50,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#9B5DE5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '85%',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#9B5DE5',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});
