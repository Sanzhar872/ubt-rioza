import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchQuizBank, groupByTopic, type QuizTopic } from "../quizBank";

export default function QuizHubPage() {
  const { slug } = useParams<{ slug: string }>();
  const [topics, setTopics] = useState<QuizTopic[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizBank()
      .then((bank) => setTopics(groupByTopic(bank)))
      .catch(() => setError("Тест сұрақтарын жүктеу мүмкін болмады."));
  }, []);

  return (
    <div className="page quiz-hub-page">
      <Link to={`/${slug}`} className="back-link">
        ← Назад
      </Link>
      <h1>Тест тақырыптары</h1>
      <p className="subtitle">Тақырыпты таңдап, тестті бастаңыз</p>
      {error && <p className="error">{error}</p>}
      {!error && !topics && <p className="subtitle">Жүктелуде...</p>}
      {topics && (
        <ul className="quiz-topic-list">
          {topics.map(({ topic, count }) => (
            <li key={topic}>
              <Link to={`/${slug}/quiz/${encodeURIComponent(topic)}`} className="quiz-topic-card">
                <span className="quiz-topic-card-title">{topic}</span>
                <span className="quiz-topic-card-count">{count} сұрақ</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
