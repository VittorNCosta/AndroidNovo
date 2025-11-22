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
import { useNavigation } from '@react-navigation/native';

// SUA CHAVE DA API DO TMDB
const API_KEY = "3047ee27aa7995cacc24925468d18c1f";

// URL CORRETA PARA TRENDING
const TMDB_URL = `https://api.themoviedb.org/3/trending/movie/week?language=pt-BR&api_key=${API_KEY}`;

const GENRES = {
  Romance: 10749,
  Ação: 28,
  Comédia: 35,
  Drama: 18,
  "Ficção Científica": 878
};

export default function Home({ route }) {
  const { usuario } = route.params || { usuario: "Usuário" };

  const navigation = useNavigation();

  const [filmes, setFilmes] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("");
  const [novidades, setNovidades] = useState([]);
  const [filmesCategoria, setFilmesCategoria] = useState([]);



  useEffect(() => {
    carregarFilmesTrending();
  }, []);

  const carregarFilmesTrending = async () => {
    try {
      const res = await fetch(TMDB_URL);
      const data = await res.json();
      setNovidades(data.results || []);
    } catch (err) {
      console.error("Erro ao carregar filmes:", err);
    }
  };


  
  const filmesFiltrados = filmes.filter(filme =>
    filme.title.toLowerCase().includes(busca.toLowerCase())
  );

  // Carregar com base no gênero clicado
  const carregarPorGenero = async (idGenero) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${idGenero}`
      );
      const data = await res.json();
      setFilmesCategoria(data.results || []);
    } catch (err) {
      console.error("Erro ao carregar gênero:", err);
    }
  };

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
    <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={styles.categoryContainer}
>
  {Object.keys(GENRES).map((cat) => (
    <TouchableOpacity
      key={cat}
      style={[
        styles.categoryButton,
        categoria === cat && { backgroundColor: "#ca0439" }
      ]}
      onPress={() => {
        setCategoria(cat);
        carregarPorGenero(GENRES[cat]);
      }}
    >
      <Text
        style={[
          styles.categoryText,
          categoria === cat && { color: "#fff" }
        ]}
      >
        {cat}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>




      {/* Lista de filmes */}
<Text style={styles.sectionTitle}>Novidades</Text>
<FlatList
  data={novidades}
  keyExtractor={(item) => item.id.toString()}
  horizontal
  showsHorizontalScrollIndicator={false}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => navigation.navigate('Detalhes', { movieId: item.id })}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.poster}
      />
      <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.movieSubtitle}>{item.release_date?.split("-")[0]}</Text>
    </TouchableOpacity>
  )}
/>

{categoria !== "" && (
  <>
    <Text style={styles.sectionTitle}>Filmes de {categoria}</Text>

    <FlatList
      data={filmesCategoria}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.movieCard}
          onPress={() => navigation.navigate('Detalhes', { movieId: item.id })}
        >
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
            style={styles.poster}
          />
          <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.movieSubtitle}>{item.release_date?.split("-")[0]}</Text>
        </TouchableOpacity>
      )}
    />
  </>
)}


      {/* Rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="home" size={22} color="#ca0439" />
          <Text style={styles.footerTextActive}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate("Favoritos")}
        >
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

  categoryContainer: {
  marginVertical: 20,
},

categoryButton: {
  paddingVertical: 6,
  paddingHorizontal: 14,
  backgroundColor: "#eee",
  borderRadius: 20,
  marginRight: 10,
  alignSelf: "flex-start",
},

categoryText: {
  color: "#333",
  fontSize: 14,
  fontWeight: "600",
},

});