import { useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import { fetchTrendingMovies } from "../../services/tmdb";
import MovieList from "../../components/MovieList/MovieList";

export default function HomePage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function getMovies() {
      try {
        const data = await fetchTrendingMovies();
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    }
    getMovies();
  }, []);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Trending Movies</h1>
      <MovieList movies={movies} />
    </main>
  );
}
