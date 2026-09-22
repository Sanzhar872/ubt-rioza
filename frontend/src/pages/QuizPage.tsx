import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchQuizTopic, type QuizQuestion } from "../quizBank";

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function resultMessage(ratio: number): string {
  if (ratio === 1) return "Тамаша! Барлық сұраққа дұрыс жауап бердіңіз.";
  if (ratio >= 0.8) return "Жақсы нәтиже! Бір-екі тақырыпты қайталап шығыңыз.";
  if (ratio >= 0.5) return "Жаман емес, бірақ қайталауға болады.";
  return "Тақырыпты қайта қарап, тестті қайталап көріңіз.";
}

export default function QuizPage() {
  const { slug, topicSlug } = useParams<{ slug: string; topicSlug: string }>();

  const [topicTitle, setTopicTitle] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (!topicSlug) return;
    setQuestions(null);
    setError(null);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    fetchQuizTopic(topicSlug)
      .then((data) => {
        if (data.questions.length === 0) {
          setError("Бұл тақырып бойынша сұрақтар табылмады.");
          return;
        }
        setTopicTitle(data.topic);
        setQuestions(shuffle(data.questions));
      })
      .catch(() => setError("Тест сұрақтарын жүктеу мүмкін болмады."));
  }, [topicSlug, runId]);

  const progressPct = useMemo(() => {
    if (!questions) return 0;
    return Math.round((Math.min(current, questions.length) / questions.length) * 100);
  }, [current, questions]);

  if (error) {
    return (
      <div className="page quiz-page">
        <Link to={`/${slug}/quiz`} className="back-link">
          ← Тақырыптарға оралу
        </Link>
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!questions) {
    return (
      <div className="page quiz-page">
        <Link to={`/${slug}/quiz`} className="back-link">
          ← Тақырыптарға оралу
        </Link>
        <p className="subtitle">Жүктелуде...</p>
      </div>
    );
  }

  const finished = current >= questions.length;

  function choose(index: number) {
    if (selected !== null || !questions) return;
    setSelected(index);
    if (index === questions[current].correct_index) {
      setScore((s) => s + 1);
    }
  }

  function next() {
    setSelected(null);
    setCurrent((c) => c + 1);
  }

  function restart() {
    setRunId((id) => id + 1);
  }

  return (
    <div className="page quiz-page">
      <Link to={`/${slug}/quiz`} className="back-link">
        ← Тақырыптарға оралу
      </Link>
      <h1 className="quiz-page-title">{topicTitle}</h1>

      {finished ? (
        <div className="quiz-result quiz-result-card">
          <p className="quiz-result-score">
            {score} / {questions.length}
          </p>
          <p className="subtitle">{resultMessage(score / questions.length)}</p>
          <div className="quiz-result-actions">
            <button className="quiz-button" onClick={restart}>
              Қайта тапсыру
            </button>
            <Link to={`/${slug}/quiz`} className="map-link">
              Тақырыптарға оралу
            </Link>
          </div>
        </div>
      ) : (
        <div className="quiz-question">
          <div className="quiz-progress-track">
            <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="quiz-progress">
            Сұрақ {current + 1} / {questions.length}
          </p>
          <p className="quiz-question-text">{questions[current].question}</p>
          <div className="quiz-options">
            {questions[current].options.map((option, i) => {
              const isCorrect = i === questions[current].correct_index;
              const isSelected = i === selected;
              let className = "quiz-option";
              if (selected !== null) {
                if (isCorrect) className += " correct";
                else if (isSelected) className += " incorrect";
                else className += " dimmed";
              }
              return (
                <button key={i} className={className} onClick={() => choose(i)} disabled={selected !== null}>
                  {option}
                </button>
              );
            })}
          </div>
          {selected !== null && questions[current].explanation && (
            <p className="quiz-explanation">{questions[current].explanation}</p>
          )}
          {selected !== null && (
            <button className="quiz-button" onClick={next}>
              {current + 1 === questions.length ? "Аяқтау" : "Келесі"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
