import { useSyncExternalStore } from "react";

// There are no accounts, so "viewed" lives in this browser only. Topic ids are
// unique across subjects, so a flat list of ids is enough.
const STORAGE_KEY = "ubt-rioza:viewed-topics";

function load(): ReadonlySet<number> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return new Set(Array.isArray(parsed) ? parsed.filter(Number.isInteger) : []);
  } catch {
    return new Set();
  }
}

// Replaced (never mutated) on every change so useSyncExternalStore sees a new snapshot.
let viewed = load();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

// Keep several open tabs in agreement.
window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY || e.key === null) {
    viewed = load();
    notify();
  }
});

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function markTopicViewed(topicId: number) {
  if (viewed.has(topicId)) return;
  viewed = new Set(viewed).add(topicId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...viewed]));
  } catch {
    // Private mode / blocked storage: the mark still holds for this session.
  }
  notify();
}

export function useViewedTopics(): ReadonlySet<number> {
  return useSyncExternalStore(subscribe, () => viewed);
}
