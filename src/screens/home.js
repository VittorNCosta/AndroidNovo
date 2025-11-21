import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// SUA CHAVE DA API DO TMDB
const API_KEY = "SUA_API_KEY_AQUI";

// URL CORRETA PARA TRENDING
const TMDB_URL = `https://api.themoviedb.org/3/trending/movie/week?language=pt-BR&api_key=${API_KEY}`;

export default function Home({ route }) {
  const { usuario } = route.params || { usuario: "Usuário" };

  const [filmes, setFilmes] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarFilmesTrending();
  }, []);

  const carregarFilmesTrending = async () => {
    try {
      const res = await fetch(TMDB_URL);
      const data = await res.json();
      setFilmes(data.results || []);
    } catch (err) {
      console.error("Erro ao carregar filmes:", err);
    }
  };

  const filmesFiltrados = filmes.filter(filme =>
    filme.title.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.saudacao}>Olá, <Text style={styles.nome}>{usuario}</Text> 👋🏻</Text>
          <Text style={styles.subtitulo}>Descubra os filmes que estão em alta abaixo!</Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      {/* Campo de busca */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Procure Aqui"
          placeholderTextColor="#999"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {/* Categorias (decorativo por enquanto) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {["Romance", "Ação", "Comédia", "Drama", "Ficção Científica"].map((cat) => (
          <TouchableOpacity key={cat} style={styles.categoryButton}>
            <Text style={styles.categoryText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de filmes */}
      <Text style={styles.sectionTitle}>Novidades</Text>
      <FlatList
        data={filmesFiltrados}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.movieCard}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              style={styles.poster}
            />
            <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.movieSubtitle}>{item.release_date?.split("-")[0]}</Text>
          </View>
        )}
      />

      {/* Rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="home" size={22} color="#ca0439" />
          <Text style={styles.footerTextActive}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="heart-outline" size={22} color="#777" />
          <Text style={styles.footerText}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="film-outline" size={22} color="#777" />
          <Text style={styles.footerText}>Cinemas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem}>
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
  saudacao: {
    fontSize: 20,
    color: "#000",
  },
  nome: {
    color: "#ca0439",
    fontWeight: "bold",
  },
  subtitulo: {
    color: "#555",
    fontSize: 13,
    marginTop: 3,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#000",
  },
  categories: {
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: "#f3f3f3",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  categoryText: {
    color: "#000",
    fontSize: 13,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginVertical: 10,
    color: "#000",
  },
  movieCard: {
    marginRight: 12,
    width: 130,
  },
  poster: {
    width: "100%",
    height: 190,
    borderRadius: 10,
  },
  movieTitle: {
    fontSize: 14,
    color: "#000",
    marginTop: 5,
  },
  movieSubtitle: {
    fontSize: 12,
    color: "#777",
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