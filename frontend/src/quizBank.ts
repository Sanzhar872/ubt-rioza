export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_index: number;
  explanation?: string;
}

export interface QuizTopicFile {
  topic: string;
  questions: QuizQuestion[];
}

export interface QuizTopicMeta {
  slug: string;
  title: string;
  file: string;
}

// One JSON file per topic, living in /public/data. To add a topic, drop its
// file there ({"topic": "...", "questions": [...]}) and add one line here.
export const QUIZ_TOPICS: QuizTopicMeta[] = [
  { slug: "tas-dauiri", title: "Тас дәуірі", file: "/data/tas-dauiri.json" },
  { slug: "algashky-adamdar-omiri", title: "Алғашқы адамдар өмірі", file: "/data/algashky-adamdar-omiri.json" },
  { slug: "kaz-jerinde-tas-dauyr", title: "Қазақстандағы палеолит", file: "/data/kaz-jerinde-tas-dauyr.json" },
  { slug: "mezolit", title: "Мезолит", file: "/data/mezolit.json" },
  { slug: "neolit", title: "Неолит", file: "/data/neolit.json" },
];

// Fetched at most once per topic per page load and shared by every caller.
const cache = new Map<string, Promise<QuizTopicFile>>();

export function fetchQuizTopic(slug: string): Promise<QuizTopicFile> {
  const meta = QUIZ_TOPICS.find((t) => t.slug === slug);
  if (!meta) return Promise.reject(new Error(`Unknown quiz topic: ${slug}`));

  let cached = cache.get(slug);
  if (!cached) {
    cached = fetch(meta.file)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${meta.file}: ${res.status}`);
        return res.json() as Promise<QuizTopicFile>;
      })
      .catch((err) => {
        cache.delete(slug); // allow retry on next call
        throw err;
      });
    cache.set(slug, cached);
  }
  return cached;
}
