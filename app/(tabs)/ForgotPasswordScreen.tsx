import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { supabase } from '../../supabase';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handlePasswordReset() {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      Alert.alert('Verifique seu email', 'Um link para redefinir sua senha foi enviado.');
    }
  }

  return (
    <View style={styles.pageContainer}>
      <Image
        source={{ uri: 'https://disciplinas.uvv.br/assets/images/uvv-brasao.png' }} // Substitua pelo link da sua imagem
        style={styles.image}
      />
      <Text style={styles.title}>Esqueci minha senha</Text>
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
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Enviando...' : 'Enviar link de redefinição'}</Text>
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
