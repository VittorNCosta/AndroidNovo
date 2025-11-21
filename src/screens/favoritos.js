import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Favoritos({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const carregarFavoritos = async () => {
      try {
        const json = await AsyncStorage.getItem("@favoritos");
        const data = json ? JSON.parse(json) : [];
        setFavoritos(data);
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
      }
    };
    const unsubscribe = navigation.addListener("focus", carregarFavoritos);
    return unsubscribe;
  }, [navigation]);

  const removerFavorito = async (id) => {
    try {
      const novosFavoritos = favoritos.filter((f) => f.id !== id);
      setFavoritos(novosFavoritos);
      await AsyncStorage.setItem("@favoritos", JSON.stringify(novosFavoritos));
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Favoritos</Text>
        <View style={styles.icons}>
          <Ionicons name="notifications-outline" size={22} color="#000" style={styles.icon}/>
          <Ionicons name="person-circle-outline" size={28} color="#000" />
        </View>
      </View>

      {favoritos.length === 0 ? (
        <Text style={styles.semFavoritos}>Nenhum filme favoritado ainda.</Text>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Detalhes", { filme: item })}
            >
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.poster}
              />
              <View style={styles.cardFooter}>
                <Text style={styles.nome} numberOfLines={1}>{item.title}</Text>
                <TouchableOpacity onPress={() => removerFavorito(item.id)}>
                  <Ionicons name="heart" size={20} color="#ca0439" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home-outline" size={22} color="#777" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="heart" size={22} color="#ca0439" />
          <Text style={styles.footerTextActive}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate("Cinemas")}>
          <Ionicons name="film-outline" size={22} color="#777" />
          <Text style={styles.footerText}>Cinemas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate("Perfil")}>
          <Ionicons name="person-outline" size={22} color="#777" />
          <Text style={styles.footerText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ca0439",
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginBottom: 15,
  },
  poster: {
    width: "100%",
    height: 190,
    borderRadius: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  nome: {
    fontSize: 14,
    color: "#000",
    flex: 1,
    marginRight: 5,
  },
  semFavoritos: {
    textAlign: "center",
    color: "#777",
    marginTop: 40,
    fontSize: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 10,
  },
  footerItem: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#777",
  },
  footerTextActive: {
    fontSize: 12,
    color: "#ca0439",
  },
});