// services/tmdb.js
const API_KEY = '3047ee27aa7995cacc24925468d18c1f'; // Sua API Key
const BASE_URL = 'https://api.themoviedb.org/3';

export const tmdbService = {
  // Buscar filmes em trending
  getTrendingMovies: async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=pt-BR`
        // ↑↑↑ ADICIONE: ?api_key=${API_KEY} ↑↑↑
      );
      
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erro ao buscar filmes em trending:', error);
      return [];
    }
  },

  // Buscar filmes populares
  getPopularMovies: async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`
        // ↑↑↑ ADICIONE: ?api_key=${API_KEY} ↑↑↑
      );
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erro ao buscar filmes populares:', error);
      return [];
    }
  },

  // Buscar detalhes de um filme
  getMovieDetails: async (movieId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`
        // ↑↑↑ ADICIONE: ?api_key=${API_KEY} ↑↑↑
      );
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
      return null;
    }
  }
};