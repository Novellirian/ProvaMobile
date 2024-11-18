import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { supabase } from '../../supabase';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      Alert.alert('Erro de Cadastro', error.message);
    } else {
      Alert.alert('Cadastro realizado com sucesso! Faça login.');
      router.replace('/LoginScreen');
    }
  }

  return (
    <View style={styles.pageContainer}>
      <Image
        source={{ uri: 'https://disciplinas.uvv.br/assets/images/uvv-brasao.png' }} // Substitua pelo link da sua imagem
        style={styles.image}
      />
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#A1A1A3"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        placeholderTextColor="#A1A1A3"
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
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
});
