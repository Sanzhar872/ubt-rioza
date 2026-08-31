import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTopics, type Topic } from "../api";

const ERA_LABELS: Record<string, string> = {
  "ТАС ДӘУІРІ": "Тас дәуірі",
  "ЕРТЕ ТЕМІР ДӘУІРІНДЕГІ ҚАЗАҚСТАН": "Ерте темір дәуірі",
  "ТҮРІК ҚАҒАНАТЫ": "Ерте орта ғасыр",
  "ҚАРАХАН": "Дамыған орта ғасыр",
};

export default function TopicListPage() {
  const { slug } = useParams<{ slug: string }>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchTopics(slug)
      .then(setTopics)
      .catch(() => setError("Не удалось загрузить темы."));
  }, [slug]);

  return (
    <div className="page">
      <Link to="/" className="back-link">
        ← Назад
      </Link>
      <div className="topic-header">
        <h1>Темы</h1>
        {slug === "kaz-tarih" && (
          <div className="topic-header-actions">
            <Link to={`/${slug}/timeline`} className="map-link">
              Таймлайн
            </Link>
            <Link to={`/${slug}/map`} className="map-link">
              Показать карту по периодам
            </Link>
          </div>
        )}
      </div>
      {error && <p className="error">{error}</p>}
      {!error && topics.length === 0 && <p className="subtitle">Темы скоро появятся.</p>}
      <ol className="topic-list">
        {topics.map((topic, i) => (
          <Fragment key={topic.id}>
            {ERA_LABELS[topic.title] && <li className="era-header">{ERA_LABELS[topic.title]}</li>}
            <li>
              <Link to={`/${slug}/topics/${topic.id}`}>
                {i + 1}. {topic.title}
              </Link>
            </li>
          </Fragment>
        ))}
      </ol>
    </div>
  );
}
