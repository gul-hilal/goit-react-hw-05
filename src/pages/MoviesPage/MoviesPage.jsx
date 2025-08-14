import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../../services/tmdb";
import MovieList from "../../components/MovieList/MovieList.jsx";
import styles from "./MoviesPage.module.css";
import toast, { Toaster } from "react-hot-toast";

export default function MoviesPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("query") ?? "";

  const [term, setTerm] = useState(q);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTerm(q);
  }, [q]);

  useEffect(() => {
    if (!q) {
      setMovies([]);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await searchMovies(q);
        setMovies(data.results || []);
      } catch (e) {
        setError("Arama sırasında bir sorun oluştu.");
      } finally {
        setLoading(false);
      }
    })();
  }, [q]);

  function handleSubmit(e) {
    e.preventDefault();
    const value = term.trim();
    if (!value) {
      toast.error("Lütfen arama terimi girin.");
      return;
    }
    setParams({ query: value });
  }

  function handleChange(e) {
    setError("");
    setTerm(e.target.value);
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="query"
          value={term}
          onChange={handleChange}
          placeholder="Search movies…"
          aria-label="Search"
        />
        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && q && movies.length === 0 && (
        <p className={styles.empty}>Sonuç bulunamadı.</p>
      )}
      {!loading && !error && <MovieList movies={movies} />}
      <Toaster position="top-right" />
    </div>
  );
}
