import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSubjects, type Subject } from "../api";

export default function SubjectSelectPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubjects()
      .then(setSubjects)
      .catch(() => setError("Не удалось загрузить предметы. Проверьте, что backend запущен."));
  }, []);

  return (
    <div className="page">
      <h1>Подготовка к ЕНТ</h1>
      <p className="subtitle">Выберите предмет</p>
      {error && <p className="error">{error}</p>}
      <div className="card-grid">
        {subjects.map((subject) => (
          <Link key={subject.id} to={`/${subject.slug}`} className="card">
            {subject.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
