import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchQuestions, fetchTopic, fetchTopics, type Topic } from "../api";
import QuizSection from "../components/QuizSection";

export default function TopicDetailPage() {
  const { slug, topicId } = useParams<{ slug: string; topicId: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [hasQuiz, setHasQuiz] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchTopics(slug).then(setTopics).catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (!topicId) return;
    setTopic(null);
    setHasQuiz(false);
    setShowQuiz(false);
    fetchTopic(Number(topicId))
      .then(setTopic)
      .catch(() => setError("Не удалось загрузить тему."));
    fetchQuestions(Number(topicId))
      .then((questions) => setHasQuiz(questions.length > 0))
      .catch(() => setHasQuiz(false));
  }, [topicId]);

  return (
    <div className="detail-layout">
      <aside className="topic-sidebar">
        <Link to={`/${slug}`} className="back-link sidebar-back">
          ← Назад
        </Link>
        <p className="sidebar-label">Темы</p>
        <ol className="sidebar-topic-list">
          {topics.map((t) => (
            <li key={t.id}>
              <button
                className={`sidebar-topic-btn ${t.id === Number(topicId) ? "active" : ""}`}
                onClick={() => navigate(`/${slug}/topics/${t.id}`)}
              >
                {t.title}
              </button>
            </li>
          ))}
        </ol>
      </aside>

      <main className="detail-main">
        {error && <p className="error">{error}</p>}
        {!topic && !error && <p className="subtitle">Загрузка...</p>}
        {topic && (
          <>
            <h1 className="detail-title">{topic.title}</h1>
            <div className="video-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${topic.youtube_id}?modestbranding=1&rel=0&iv_load_policy=3&color=white`}
                title={topic.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {hasQuiz ? (
              <button className="quiz-button" onClick={() => setShowQuiz((v) => !v)}>
                {showQuiz ? "Скрыть тест" : "Открыть тест"}
              </button>
            ) : (
              <button className="quiz-button" disabled title="Тест скоро появится">
                Открыть тест
              </button>
            )}
            {showQuiz && topic && <QuizSection topicId={topic.id} />}
          </>
        )}
      </main>
    </div>
  );
}
