import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  TextInput,
  Linking,
  Modal
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { tmdbService } from "../../services/tmdb";

import {
  addReview,
  updateReview,
  deleteReview,
  getReviews
} from "../../services/reviews";

export default function Detalhes({ route, navigation }) {
  const { movieId } = route.params;

  const [filme, setFilme] = useState(null);
  const [favorito, setFavorito] = useState(false);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);

  // Avaliação do usuário
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [hasReview, setHasReview] = useState(false);

  // Modal de avaliação
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    carregarTudo();
  }, []);

  async function carregarTudo() {
    try {
      const data = await tmdbService.getMovieDetails(movieId);
      setFilme(data);

      const fav = await AsyncStorage.getItem("@favoritos");
      const favs = fav ? JSON.parse(fav) : [];
      setFavorito(favs.some(f => f.id === data.id));

      const credits = await tmdbService.getMovieCredits(movieId);
      setCast(credits.cast?.slice(0, 5) || []);

      const videos = await tmdbService.getMovieVideos(movieId);
      const trailerVideo = videos.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      setTrailer(trailerVideo);

      // Carregar avaliação do usuário
      const all = await getReviews();
      const r = all.find(rv => rv.movieId === movieId);

      if (r) {
        setUserRating(r.rating);
        setUserComment(r.comment);
        setHasReview(true);
      }
    } catch (e) {
      console.log("Erro:", e);
    }
  }

  const toggleFavorito = async () => {
    const favs = JSON.parse(await AsyncStorage.getItem("@favoritos")) || [];

    let newFavs;
    if (favorito) {
      newFavs = favs.filter(f => f.id !== filme.id);
    } else {
      newFavs = [...favs, filme];
    }

    setFavorito(!favorito);
    await AsyncStorage.setItem("@favoritos", JSON.stringify(newFavs));
  };

  async function salvarAvaliacao() {
    if (userRating < 1) {
      alert("Escolha uma nota.");
      return;
    }

    if (hasReview) {
      await updateReview(movieId, userRating, userComment);
    } else {
      await addReview(movieId, userRating, userComment);
      setHasReview(true);
    }

    setModalVisible(false);
  }

  async function removerAvaliacao() {
    await deleteReview(movieId);
    setUserRating(0);
    setUserComment("");
    setHasReview(false);
    setModalVisible(false);
  }

  if (!filme) {
    return (
      <View style={styles.center}>
        <Text>Carregando detalhes...</Text>
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
        <TouchableOpacity onPress={toggleFavorito}>
          <Ionicons 
            name={favorito ? "heart" : "heart-outline"} 
            size={26} 
            color="#ca0439" 
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Image 
          source={{ uri: `https://image.tmdb.org/t/p/w500${filme.poster_path}` }}
          style={styles.poster}
        />

        <Text style={styles.nome}>{filme.title}</Text>

        <View style={styles.infoBox}>
          <Ionicons name="star" size={18} color="#FFD700" />
          <Text style={styles.nota}>
            {filme.vote_average.toFixed(1)}
          </Text>
        </View>

        <Text style={styles.subtitulo}>Sinopse</Text>
        <Text style={styles.descricao}>
          {filme.overview || "Sem descrição disponível."}
        </Text>

        {cast.length > 0 && (
          <>
            <Text style={styles.subtitulo}>Elenco</Text>
            <Text style={styles.descricao}>
              {cast.map((a) => a.name).join(", ")}
            </Text>
          </>
        )}

        {trailer && (
          <>
            <Text style={styles.subtitulo}>Trailer</Text>
            <TouchableOpacity 
              onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`)}
            >
              <Text style={[styles.descricao, { color: "#ca0439" }]}>
                Assistir no YouTube ▶️
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Avaliação já feita */}
        {hasReview && (
          <>
            <Text style={styles.subtitulo}>Minha Avaliação</Text>

            <View style={{ flexDirection: "row", marginBottom: 5 }}>
              {[1,2,3,4,5].map((n) => (
                <Ionicons
                  key={n}
                  name={userRating >= n ? "star" : "star-outline"}
                  size={26}
                  color="#FFD700"
                  style={{ marginRight: 5 }}
                />
              ))}
            </View>

            {userComment.trim() !== "" && (
              <Text style={styles.descricao}>{userComment}</Text>
            )}
          </>
        )}

        {/* Botão AVALIAR */}
        <TouchableOpacity style={styles.btnAvaliar} onPress={() => setModalVisible(true)}>
          <Text style={styles.btnAvaliarText}>
            {hasReview ? "Editar Avaliação" : "Avaliar"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ---------------------- */}
      {/* MODAL CENTRAL BRANCO  */}
      {/* ---------------------- */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitulo}>Sua Avaliação</Text>

            {/* Estrelas */}
            <View style={{ flexDirection: "row", marginBottom: 20 }}>
              {[1,2,3,4,5].map((n) => (
                <TouchableOpacity key={n} onPress={() => setUserRating(n)}>
                  <Ionicons
                    name={userRating >= n ? "star" : "star-outline"}
                    size={32}
                    color="#FFD700"
                    style={{ marginRight: 5 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Comentário */}
            <TextInput
              placeholder="Escreva um comentário (opcional)"
              placeholderTextColor="#777"
              multiline
              style={styles.modalInput}
              value={userComment}
              onChangeText={setUserComment}
            />

            {/* Botões */}
            <TouchableOpacity style={styles.btnSalvar} onPress={salvarAvaliacao}>
              <Text style={styles.btnSalvarText}>Salvar</Text>
            </TouchableOpacity>

            {hasReview && (
              <TouchableOpacity style={styles.btnExcluir} onPress={removerAvaliacao}>
                <Text style={styles.btnExcluirText}>Excluir Avaliação</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.btnCancelar}>Cancelar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50, paddingHorizontal: 15 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  titulo: { fontSize: 20, fontWeight: "bold", color: "#ca0439" },
  poster: { width: "100%", height: 450, borderRadius: 12, marginBottom: 20 },
  nome: { fontSize: 22, fontWeight: "bold", color: "#000", marginBottom: 5 },
  infoBox: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  nota: { fontSize: 16, color: "#555", marginLeft: 5 },
  subtitulo: { fontSize: 18, fontWeight: "bold", color: "#ca0439", marginBottom: 5 },
  descricao: { fontSize: 15, color: "#333", marginBottom: 20 },

  btnAvaliar: {
    backgroundColor: "#ca0439",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  btnAvaliarText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },

  modalBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    elevation: 5
  },

  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
    color: "#000",
    marginBottom: 20
  },

  btnSalvar: {
    backgroundColor: "#ca0439",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10
  },

  btnSalvarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  btnExcluir: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#ddd",
    marginBottom: 10
  },

  btnExcluirText: { color: "#000", fontWeight: "bold", fontSize: 16 },

  btnCancelar: {
    color: "#ca0439",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
    fontWeight: "600"
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" }
});