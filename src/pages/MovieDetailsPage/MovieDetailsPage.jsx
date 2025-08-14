import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { fetchMovieDetails, posterUrl } from "../../services/tmdb";
import toast from "react-hot-toast";
import s from "./MovieDetailsPage.module.css";

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const location = useLocation();
  const backRef = useRef(location.state?.from || "/movies");

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function run() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchMovieDetails(movieId);
        if (!ignore) setMovie(data);
      } catch (e) {
        if (!ignore) {
          setError("Movie details could not be loaded.");
          toast.error("Movie details could not be loaded.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [movieId]);

  if (loading) return <main className={s.container}>Loading…</main>;
  if (error) return <main className={s.container} style={{ color: "tomato" }}>{error}</main>;
  if (!movie) return null;

  const title = movie.title || movie.name || "Untitled";
  const score = typeof movie.vote_average === "number" ? Math.round(movie.vote_average * 10) : null;
  const genres = Array.isArray(movie.genres) ? movie.genres.map((g) => g.name).filter(Boolean).join(", ") : "";
  const poster = posterUrl(movie.poster_path) || "https://via.placeholder.com/220x330?text=No+Image";

  return (
    <main className={s.container}>
      <Link to={backRef.current} className={s.backLink} aria-label="Go back">
        ← Go back
      </Link>

      <div className={s.details}>
        <img src={poster} alt={title} className={s.poster} />
        <div className={s.info}>
          <h2 className={s.title}>{title}</h2>
          {score !== null && <p className={s.score}>User Score: {score}%</p>}
          {movie.overview && (
            <>
              <h3 className={s.sectionTitle}>Overview</h3>
              <p>{movie.overview}</p>
            </>
          )}
          {genres && (
            <>
              <h4 className={s.sectionTitle}>Genres</h4>
              <p>{genres}</p>
            </>
          )}
        </div>
      </div>

      <nav className={s.subnav} aria-label="Additional information">
        <NavLink to="cast" className={({ isActive }) => `${s.tabLink} ${isActive ? s.active : ""}`}>cast</NavLink>
        <NavLink to="reviews" className={({ isActive }) => `${s.tabLink} ${isActive ? s.active : ""}`}>reviews</NavLink>
      </nav>

      <Outlet />
    </main>
  );
}
