import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../../assets/logo.png')} style={styles.logo} />

      {/* Campo Usuário */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Usuário"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <Ionicons name="person-outline" size={20} color="#999" style={styles.icon} />
      </View>

      {/* Campo Senha */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#999"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Botão de Login */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>

      {/* Link de cadastro */}
      <Text style={styles.registerText}>
        Ainda não tem uma conta?{' '}
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          Clique aqui!
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
  },
  input: {
    flex: 1,
    height: 50,
    color: '#000',
  },
  icon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#E50914',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 14,
  },
  registerLink: {
    color: '#E50914',
    fontWeight: 'bold',
  },
});
