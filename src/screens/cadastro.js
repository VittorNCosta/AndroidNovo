import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { registerUser } from '../../services/auth';

export default function Cadastro({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);

  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function handleCadastro() {
    if (!nome || !usuario || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    await registerUser(usuario, senha);

    Alert.alert("Sucesso", "Conta criada com sucesso!");
    navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>
      
      {/* Logo */}
      <Image source={require('../../assets/logo.png')} style={styles.logo} />

      {/* Campo: Nome */}
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder="Carlos Manuel" 
          placeholderTextColor="#999" 
          style={styles.input}
          onChangeText={setNome}
        />
        <Ionicons name={nome ? "checkmark-circle" : "close-circle-outline"} size={20} color={nome ? "#4CAF50" : "#999"} />
      </View>

      {/* Campo: Usuário */}
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder="Carlos1241" 
          placeholderTextColor="#999" 
          style={styles.input}
          onChangeText={setUsuario}
        />
        <Ionicons name={usuario ? "checkmark-circle" : "close-circle-outline"} size={20} color={usuario ? "#4CAF50" : "#999"} />
      </View>

      {/* Campo: Email */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Carlos@gmail.com"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <Ionicons name={email ? "checkmark-circle" : "close-circle-outline"} size={20} color={email ? "#4CAF50" : "#999"} />
      </View>

      {/* Campo: Senha */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="************"
          placeholderTextColor="#999"
          style={styles.input}
          secureTextEntry={!showPassword}
          onChangeText={setSenha}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Botão Criar Conta */}
      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>

      {/* Link Login */}
      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
          Log in here
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
    width: 150,
    height: 150,
    marginBottom: 40,
    borderRadius: 75,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: '100%',
    height: 45,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#E50914',
    borderRadius: 8,
    height: 45,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginText: {
    color: '#ccc',
    marginTop: 15,
    fontSize: 13,
  },
  linkText: {
    color: '#E50914',
    fontWeight: '600',
  },
});