import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Detalhes({ route, navigation }) {
  const { filme } = route.params;
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    const verificarFavorito = async () => {
      try {
        const json = await AsyncStorage.getItem("@favoritos");
        const data = json ? JSON.parse(json) : [];
        const jaFavoritado = data.some((f) => f.id === filme.id);
        setFavorito(jaFavoritado);
      } catch (error) {
        console.error("Erro ao verificar favorito:", error);
      }
    };
    verificarFavorito();
  }, []);

  const toggleFavorito = async () => {
    try {
      const json = await AsyncStorage.getItem("@favoritos");
      const data = json ? JSON.parse(json) : [];
      let novosFavoritos;

      if (favorito) {
        novosFavoritos = data.filter((f) => f.id !== filme.id);
      } else {
        novosFavoritos = [...data, filme];
      }

      await AsyncStorage.setItem("@favoritos", JSON.stringify(novosFavoritos));
      setFavorito(!favorito);
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Detalhes</Text>
        <TouchableOpacity onPress={toggleFavorito}>
          <Ionicons 
            name={favorito ? "heart" : "heart-outline"} 
            size={26} 
            color="#ca0439" 
          />
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image 
          source={{ uri: `https://image.tmdb.org/t/p/w500${filme.poster_path}` }}
          style={styles.poster}
        />

        <Text style={styles.nome}>{filme.title}</Text>

        <View style={styles.infoBox}>
          <Ionicons name="star" size={18} color="#FFD700" />
          <Text style={styles.nota}>{filme.vote_average.toFixed(1)}</Text>
        </View>

        <Text style={styles.subtitulo}>Sinopse</Text>
        <Text style={styles.descricao}>
          {filme.overview ? filme.overview : "Sem descrição disponível."}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ca0439",
  },
  poster: {
    width: "100%",
    height: 450,
    borderRadius: 12,
    marginBottom: 20,
  },
  nome: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  nota: {
    fontSize: 16,
    color: "#555",
    marginLeft: 5,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ca0439",
    marginBottom: 5,
  },
  descricao: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
    marginBottom: 40,
  },
});