import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchQuizTopic, QUIZ_TOPICS } from "../quizBank";

export default function QuizHubPage() {
  const { slug } = useParams<{ slug: string }>();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    QUIZ_TOPICS.forEach((meta) => {
      fetchQuizTopic(meta.slug)
        .then((data) => setCounts((c) => ({ ...c, [meta.slug]: data.questions.length })))
        .catch(() => {});
    });
  }, []);

  return (
    <div className="page quiz-hub-page">
      <Link to={`/${slug}`} className="back-link">
        ← Назад
      </Link>
      <h1>Тест тақырыптары</h1>
      <p className="subtitle">Тақырыпты таңдап, тестті бастаңыз</p>
      <ul className="quiz-topic-list">
        {QUIZ_TOPICS.map(({ slug: topicSlug, title }) => (
          <li key={topicSlug}>
            <Link to={`/${slug}/quiz/${topicSlug}`} className="quiz-topic-card">
              <span className="quiz-topic-card-title">{title}</span>
              {counts[topicSlug] !== undefined && (
                <span className="quiz-topic-card-count">{counts[topicSlug]} сұрақ</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
