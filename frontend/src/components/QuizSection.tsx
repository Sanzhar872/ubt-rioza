import { useEffect, useState } from "react";
import { fetchQuestions, type Question } from "../api";

interface Props {
  topicId: number;
}

export default function QuizSection({ topicId }: Props) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setQuestions(null);
    setError(null);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    fetchQuestions(topicId)
      .then(setQuestions)
      .catch(() => setError("Не удалось загрузить тест."));
  }, [topicId]);

  if (error) return <p className="error">{error}</p>;
  if (!questions) return <p className="subtitle">Загрузка теста...</p>;

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
    setSelected(null);
    setCurrent(0);
    setScore(0);
  }

  return (
    <div className="quiz-section">
      {finished ? (
        <div className="quiz-result">
          <p className="subtitle">
            Результат: {score} / {questions.length}
          </p>
          <button className="quiz-button" onClick={restart}>
            Пройти ещё раз
          </button>
        </div>
      ) : (
        <div className="quiz-question">
          <p className="quiz-progress">
            Вопрос {current + 1} / {questions.length}
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
              {current + 1 === questions.length ? "Завершить" : "Дальше"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
