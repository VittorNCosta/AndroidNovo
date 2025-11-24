// myproject/src/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/home";
import Login from "../screens/login";
import Cadastro from "../screens/cadastro";
import Cinema from "../screens/cinema";
import Detalhes from "../screens/detalhes";
import Favoritos from "../screens/favoritos";
// Se você tiver a tela de Perfil depois, pode importar aqui:
// import Perfil from "../screens/perfil";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        {/* Fluxo de autenticação */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />

        {/* Telas principais */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Cinema" component={Cinema} />
        <Stack.Screen name="Detalhes" component={Detalhes} />
        <Stack.Screen name="Favoritos" component={Favoritos} />

        {/* Se houver Perfil */}
        {/* <Stack.Screen name="Perfil" component={Perfil} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}