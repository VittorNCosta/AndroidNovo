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

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // esconder cabeçalho padrão
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Cinema" component={Cinema} />
        <Stack.Screen name="Detalhes" component={Detalhes} />
        <Stack.Screen name="Favoritos" component={Favoritos} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}