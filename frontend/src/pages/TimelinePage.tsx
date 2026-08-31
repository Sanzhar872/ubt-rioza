import { Link, useParams } from "react-router-dom";

export default function TimelinePage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="page">
      <Link to={`/${slug}`} className="back-link">
        ← К темам
      </Link>
      <h1>Таймлайн</h1>
      <p className="subtitle">Таймлайн скоро появится.</p>
    </div>
  );
}
