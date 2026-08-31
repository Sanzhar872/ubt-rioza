const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface Subject {
  id: number;
  slug: string;
  title: string;
}

export interface Topic {
  id: number;
  title: string;
  youtube_id: string;
  order_index: number;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${path}`);
  }
  return res.json();
}

export function fetchSubjects(): Promise<Subject[]> {
  return get<Subject[]>("/api/subjects");
}

export function fetchTopics(subjectSlug: string): Promise<Topic[]> {
  return get<Topic[]>(`/api/subjects/${subjectSlug}/topics`);
}

export function fetchTopic(topicId: number): Promise<Topic> {
  return get<Topic>(`/api/topics/${topicId}`);
}

export function fetchQuestions(topicId: number): Promise<Question[]> {
  return get<Question[]>(`/api/topics/${topicId}/questions`);
}
