// src/services/tmdb.js
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // v3 API key
const client = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: API_KEY, language: "en-US" },
});

// Ana sayfa: günün trend filmleri
export async function fetchTrendingMovies() {
  const { data } = await client.get("/trending/movie/day");
  return data; // { results, ... }
}

// Arama sayfası
export async function searchMovies(query, page = 1) {
  const { data } = await client.get("/search/movie", {
    params: { query, page, include_adult: false },
  });
  return data;
}

// Detay sayfası
export async function fetchMovieDetails(movieId) {
  const { data } = await client.get(`/movie/${movieId}`);
  return data;
}

export async function fetchMovieCredits(movieId) {
  const { data } = await client.get(`/movie/${movieId}/credits`);
  return data;
}

export async function fetchMovieReviews(movieId, page = 1) {
  const { data } = await client.get(`/movie/${movieId}/reviews`, {
    params: { page },
  });
  return data;
}

// Poster yardımcı
export function posterUrl(path, size = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
}