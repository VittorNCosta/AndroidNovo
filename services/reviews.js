import AsyncStorage from "@react-native-async-storage/async-storage";

const REVIEWS_KEY = "@user_reviews";

// GET — lista todas avaliações
export async function getReviews() {
  const data = await AsyncStorage.getItem(REVIEWS_KEY);
  return data ? JSON.parse(data) : [];
}

// POST — cria avaliação
export async function addReview(movieId, rating, comment) {
  const reviews = await getReviews();

  const newReview = {
    movieId,
    rating,
    comment,
    date: new Date().toISOString(),
  };

  reviews.push(newReview);

  await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  return newReview;
}

// PUT — editar avaliação
export async function updateReview(movieId, newRating, newComment) {
  const reviews = await getReviews();

  const updated = reviews.map(r =>
    r.movieId === movieId
      ? { ...r, rating: newRating, comment: newComment, date: new Date().toISOString() }
      : r
  );

  await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));
  return true;
}

// DELETE — remover avaliação
export async function deleteReview(movieId) {
  const reviews = await getReviews();

  const filtered = reviews.filter(r => r.movieId !== movieId);

  await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(filtered));
  return true;
}