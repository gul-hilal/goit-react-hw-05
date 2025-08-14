import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieReviews } from "../../services/tmdb.js";
import styles from "./MovieReviews.module.css";

export default function MovieReviews() {
  const { movieId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchMovieReviews(movieId);
        if (!ignore) setReviews(data.results || []);
      } catch (e) {
        if (!ignore) setError("Reviews could not be loaded.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [movieId]);

  if (loading) return <p className={styles.info}>Loading reviews…</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!reviews.length) return <p className={styles.info}>No reviews yet.</p>;

  return (
    <ul className={styles.list}>
      {reviews.map(({ id, author, content, created_at, url }) => (
        <li key={id} className={styles.item}>
          <div className={styles.header}>
            <strong className={styles.author}>{author}</strong>
            {created_at && (
              <span className={styles.date}>
                {new Date(created_at).toLocaleDateString()}
              </span>
            )}
          </div>
          <p className={styles.text}>{content}</p>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              Read on TMDB
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
