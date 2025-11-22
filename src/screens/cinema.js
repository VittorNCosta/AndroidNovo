import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, Button, TouchableOpacity  } from 'react-native';
import { tmdbService } from '../../services/tmdb';
import { useNavigation } from '@react-navigation/native';

export default function Cinema() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  const loadTrendingMovies = async () => {
    setLoading(true);
    const trendingMovies = await tmdbService.getTrendingMovies();
    setMovies(trendingMovies);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Carregando filmes...</Text>
      </View>
    );
  }

const [query, setQuery] = useState('');

const handleSearch = async () => {
  if (!query) {
    loadTrendingMovies(); // volta para trending
    return;
  }
  setLoading(true);
  const results = await tmdbService.searchMovies(query);
  setMovies(results);
  setLoading(false);
};

const navigation = useNavigation();

  return (
 <View style={styles.container}>
  <Text style={styles.title}>Filmes em Trending</Text>

  {/* Barra de pesquisa */}
  <View style={{ flexDirection: 'row', marginBottom: 10 }}>
    <TextInput
      style={{ flex: 1, backgroundColor: '#333', color: '#fff', padding: 8, borderRadius: 4 }}
      placeholder="Pesquisar filme"
      placeholderTextColor="#888"
      value={query}
      onChangeText={setQuery}
    />
    <Button title="Buscar" onPress={handleSearch} />
  </View>

  <FlatList
  data={movies}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => navigation.navigate('Detalhes', { movieId: item.id })}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.poster}
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieRating}>⭐ {item.vote_average}</Text>
        <Text style={styles.movieOverview} numberOfLines={3}>
          {item.overview}
        </Text>
      </View>
    </TouchableOpacity>
  )}
/>
</View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#222',
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 4,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 10,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  movieRating: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
  },
  movieOverview: {
    fontSize: 12,
    color: '#aaa',
  },
});
