import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Linking 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { tmdbService } from '../../services/tmdb';

export default function Detalhes({ route, navigation }) {
  const { movieId } = route.params;
  const [filme, setFilme] = useState(null);
  const [favorito, setFavorito] = useState(false);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Carregar todos os dados de uma vez
  useEffect(() => {
    const carregarTodosDados = async () => {
      if (!movieId) return;

      try {
        // Carregar detalhes do filme
        const data = await tmdbService.getMovieDetails(movieId);
        setFilme(data);

        // Verificar favorito APÓS carregar o filme
        const json = await AsyncStorage.getItem("@favoritos");
        const favoritosData = json ? JSON.parse(json) : [];
        const jaFavoritado = favoritosData.some((f) => f.id === data.id);
        setFavorito(jaFavoritado);

        // Carregar outros dados
        const credits = await tmdbService.getMovieCredits(movieId);
        setCast(credits.cast?.slice(0, 5) || []);

        const videos = await tmdbService.getMovieVideos(movieId);
        const trailerVideo = videos.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailer(trailerVideo);

        const reviewsData = await tmdbService.getMovieReviews(movieId);
        setReviews(reviewsData.results || []);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    carregarTodosDados();
  }, [movieId]);

  // Função toggleFavorito completamente refatorada
  const toggleFavorito = async () => {
    if (!filme) return;
    
    try {
      // Usar await para garantir que temos os dados mais recentes
      const json = await AsyncStorage.getItem("@favoritos");
      const data = json ? JSON.parse(json) : [];

      let novosFavoritos;
      const jaFavoritado = data.some(f => f.id === filme.id);
      
      if (jaFavoritado) {
        // Remover dos favoritos
        novosFavoritos = data.filter((f) => f.id !== filme.id);
        setFavorito(false);
      } else {
        // Adicionar aos favoritos
        novosFavoritos = [...data, filme];
        setFavorito(true);
      }

      // Salvar no AsyncStorage
      await AsyncStorage.setItem("@favoritos", JSON.stringify(novosFavoritos));
      
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
      // Reverter o estado em caso de erro
      setFavorito(prev => !prev);
    }
  };

  // Versão alternativa mais segura - desabilita o botão durante a atualização
  const [atualizandoFavorito, setAtualizandoFavorito] = useState(false);

  const toggleFavoritoSeguro = async () => {
    if (!filme || atualizandoFavorito) return;
    
    setAtualizandoFavorito(true);
    
    try {
      const json = await AsyncStorage.getItem("@favoritos");
      const data = json ? JSON.parse(json) : [];

      let novosFavoritos;
      const jaFavoritado = data.some(f => f.id === filme.id);
      
      if (jaFavoritado) {
        novosFavoritos = data.filter((f) => f.id !== filme.id);
        setFavorito(false);
      } else {
        novosFavoritos = [...data, filme];
        setFavorito(true);
      }

      await AsyncStorage.setItem("@favoritos", JSON.stringify(novosFavoritos));
      
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
      setFavorito(prev => !prev);
    } finally {
      setAtualizandoFavorito(false);
    }
  };

  if (!filme) {
    return (
      <View style={styles.center}>
        <Text>Carregando detalhes do filme...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Detalhes</Text>
        <TouchableOpacity 
          onPress={toggleFavoritoSeguro} 
          disabled={atualizandoFavorito}
        >
          <Ionicons 
            name={favorito ? "heart" : "heart-outline"} 
            size={26} 
            color={atualizandoFavorito ? "#ccc" : "#ca0439"} 
          />
        </TouchableOpacity>
      </View>

      {/* Resto do conteúdo */}
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

        {/* Elenco */}
        {cast.length > 0 && (
          <>
            <Text style={styles.subtitulo}>Elenco</Text>
            <Text style={styles.descricao}>
              {cast.map((a) => a.name).join(", ")}
            </Text>
          </>
        )}

        {/* Trailer */}
        {trailer && (
          <>
            <Text style={styles.subtitulo}>Trailer</Text>
            <TouchableOpacity 
              onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`)}
            >
              <Text style={[styles.descricao, {color: "#ca0439"}]}>
                Assistir no YouTube ▶️
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Avaliações */}
        {reviews.length > 0 && (
          <>
            <Text style={styles.subtitulo}>Avaliações</Text>
            {reviews.map((r) => (
              <View key={r.id} style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>{r.author}</Text>
                <Text style={styles.descricao}>{r.content}</Text>
              </View>
            ))}
          </>
        )}
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});