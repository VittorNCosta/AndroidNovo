import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { tmdbService } from '../../services/tmdb';

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filmes em Trending</Text>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movieCard}>
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
          </View>
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
