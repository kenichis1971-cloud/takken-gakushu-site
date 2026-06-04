import type { TakkenPracticeQuestion } from "./takkenPractice";

export const TAKKEN_SEEN_QUESTIONS_STORAGE_KEY = "takken_seen_questions_v1";

export type TakkenSeenQuestionMode = "random50" | "subject" | "trap";

export type TakkenSeenQuestionRecord = {
  id: string;
  seenAt: string;
  timesSeen: number;
  lastMode: TakkenSeenQuestionMode;
  lastSubject?: string;
  lastTrapType?: string;
};

export type TakkenSeenQuestionMap = Record<string, TakkenSeenQuestionRecord>;

export type TakkenSeenStats = {
  totalCount: number;
  seenCount: number;
  unseenCount: number;
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isSeenRecord(value: unknown, id: string): value is TakkenSeenQuestionRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<TakkenSeenQuestionRecord>;

  return (
    record.id === id &&
    typeof record.seenAt === "string" &&
    typeof record.timesSeen === "number" &&
    Number.isFinite(record.timesSeen) &&
    (record.lastMode === "random50" || record.lastMode === "subject" || record.lastMode === "trap")
  );
}

function getUniqueQuestions(questions: TakkenPracticeQuestion[]) {
  return Array.from(new Map(questions.map((question) => [question.id, question])).values());
}

function shuffleQuestions(questions: TakkenPracticeQuestion[]) {
  const shuffledQuestions = [...questions];

  for (let index = shuffledQuestions.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledQuestions[index], shuffledQuestions[randomIndex]] = [
      shuffledQuestions[randomIndex],
      shuffledQuestions[index],
    ];
  }

  return shuffledQuestions;
}

function getSeenTime(record: TakkenSeenQuestionRecord | undefined) {
  if (!record) {
    return 0;
  }

  const time = Date.parse(record.seenAt);

  return Number.isNaN(time) ? 0 : time;
}

export function getSeenQuestionMap(): TakkenSeenQuestionMap {
  if (!canUseLocalStorage()) {
    return {};
  }

  const storedValue = window.localStorage.getItem(TAKKEN_SEEN_QUESTIONS_STORAGE_KEY);

  if (!storedValue) {
    return {};
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (!parsedValue || typeof parsedValue !== "object" || Array.isArray(parsedValue)) {
      return {};
    }

    return Object.entries(parsedValue).reduce<TakkenSeenQuestionMap>((seenMap, [id, value]) => {
      if (isSeenRecord(value, id)) {
        seenMap[id] = {
          id,
          seenAt: value.seenAt,
          timesSeen: Math.max(1, Math.floor(value.timesSeen)),
          lastMode: value.lastMode,
          lastSubject: typeof value.lastSubject === "string" ? value.lastSubject : undefined,
          lastTrapType: typeof value.lastTrapType === "string" ? value.lastTrapType : undefined,
        };
      }

      return seenMap;
    }, {});
  } catch {
    return {};
  }
}

export function saveSeenQuestions(
  questions: TakkenPracticeQuestion[],
  mode: TakkenSeenQuestionMode,
  subject?: string,
  trapType?: string,
): TakkenSeenQuestionMap {
  const currentMap = getSeenQuestionMap();
  const seenAt = new Date().toISOString();

  getUniqueQuestions(questions).forEach((question) => {
    const currentRecord = currentMap[question.id];

    currentMap[question.id] = {
      id: question.id,
      seenAt,
      timesSeen: (currentRecord?.timesSeen ?? 0) + 1,
      lastMode: mode,
      lastSubject: mode === "subject" ? subject : currentRecord?.lastSubject,
      lastTrapType: mode === "trap" ? trapType : currentRecord?.lastTrapType,
    };
  });

  if (canUseLocalStorage()) {
    window.localStorage.setItem(TAKKEN_SEEN_QUESTIONS_STORAGE_KEY, JSON.stringify(currentMap));
  }

  return currentMap;
}

export function clearSeenQuestions() {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(TAKKEN_SEEN_QUESTIONS_STORAGE_KEY);
  }
}

export function getSeenStats(
  allQuestions: TakkenPracticeQuestion[],
  seenMap: TakkenSeenQuestionMap = getSeenQuestionMap(),
): TakkenSeenStats {
  const uniqueQuestions = getUniqueQuestions(allQuestions);
  const seenCount = uniqueQuestions.filter((question) => seenMap[question.id]).length;

  return {
    totalCount: uniqueQuestions.length,
    seenCount,
    unseenCount: uniqueQuestions.length - seenCount,
  };
}

export function pickQuestionsWithUnseenPriority(
  pool: TakkenPracticeQuestion[],
  count: number,
  seenMap: TakkenSeenQuestionMap = getSeenQuestionMap(),
) {
  const uniquePool = getUniqueQuestions(pool);
  const targetCount = Math.max(0, Math.min(count, uniquePool.length));
  const unseenQuestions = uniquePool.filter((question) => !seenMap[question.id]);
  const seenQuestions = uniquePool.filter((question) => seenMap[question.id]);
  const selectedQuestions = shuffleQuestions(unseenQuestions).slice(0, targetCount);

  if (selectedQuestions.length >= targetCount) {
    return selectedQuestions;
  }

  const randomTieBreakers = new Map(seenQuestions.map((question) => [question.id, Math.random()]));
  const recentlyUnseenQuestions = [...seenQuestions].sort((current, next) => {
    const currentRecord = seenMap[current.id];
    const nextRecord = seenMap[next.id];
    const seenAtDiff = getSeenTime(currentRecord) - getSeenTime(nextRecord);

    if (seenAtDiff !== 0) {
      return seenAtDiff;
    }

    const timesSeenDiff = (currentRecord?.timesSeen ?? 0) - (nextRecord?.timesSeen ?? 0);

    if (timesSeenDiff !== 0) {
      return timesSeenDiff;
    }

    return (randomTieBreakers.get(current.id) ?? 0) - (randomTieBreakers.get(next.id) ?? 0);
  });

  return selectedQuestions.concat(recentlyUnseenQuestions.slice(0, targetCount - selectedQuestions.length));
}
