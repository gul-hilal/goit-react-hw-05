import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./HomePage.module.css";
import { fetchTrendingMovies } from "../../services/tmdb";

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
      <ul className={styles.movieList}>
        {movies.map((movie) => (
          <li key={movie.id} className={styles.movieCard}>
            <Link to={`/movies/${movie.id}`} className={styles.movieTitle}>
              {movie.title || movie.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
