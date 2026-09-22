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

// Each prepared question file lives in /public/data. Add new files here as
// they're ready — no other code needs to change.
const BANK_FILES = ["/data/kaz-tarih-quiz.json", "/data/tas-dauyr-2.json"];

// Fetched once per page load and shared by every caller.
let bankPromise: Promise<QuizQuestion[]> | null = null;

async function loadFile(url: string): Promise<QuizQuestion[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load quiz bank: ${url} (${res.status})`);
  return res.json() as Promise<QuizQuestion[]>;
}

export function fetchQuizBank(): Promise<QuizQuestion[]> {
  if (!bankPromise) {
    bankPromise = Promise.all(BANK_FILES.map(loadFile))
      .then((files) => files.flat())
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
