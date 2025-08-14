import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieCredits } from "../../services/tmdb.js";
import styles from "./MovieCast.module.css";

const IMG_BASE = "https://image.tmdb.org/t/p/w185";
const FALLBACK = "https://via.placeholder.com/185x278?text=No+Image";

export default function MovieCast() {
  const { movieId } = useParams();
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchMovieCredits(movieId);
        if (!ignore) setCast(data.cast || []);
      } catch (e) {
        if (!ignore) setError("Cast could not be loaded.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [movieId]);

  if (loading) return <p className={styles.info}>Loading cast…</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!cast.length) return <p className={styles.info}>No cast info.</p>;

  return (
    <ul className={styles.list}>
      {cast.map(({ id, name, character, profile_path }) => (
        <li key={id} className={styles.item}>
          <img
            src={profile_path ? IMG_BASE + profile_path : FALLBACK}
            alt={name}
            loading="lazy"
            className={styles.image}
          />
          <div>
            <p className={styles.name}>{name}</p>
            {character && <p className={styles.character}>as {character}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
