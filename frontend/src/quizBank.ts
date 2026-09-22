export interface QuizQuestion {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation?: string;
}

export interface QuizTopic {
  topic: string;
  count: number;
}

const BANK_URL = "/data/kaz-tarih-quiz.json";

// Fetched once per page load and shared by every caller.
let bankPromise: Promise<QuizQuestion[]> | null = null;

export function fetchQuizBank(): Promise<QuizQuestion[]> {
  if (!bankPromise) {
    bankPromise = fetch(BANK_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load quiz bank: ${res.status}`);
        return res.json() as Promise<QuizQuestion[]>;
      })
      .catch((err) => {
        bankPromise = null; // allow retry on next call
        throw err;
      });
  }
  return bankPromise;
}

export function groupByTopic(questions: QuizQuestion[]): QuizTopic[] {
  const counts = new Map<string, number>();
  for (const q of questions) {
    counts.set(q.topic, (counts.get(q.topic) ?? 0) + 1);
  }
  return [...counts.entries()].map(([topic, count]) => ({ topic, count }));
}
