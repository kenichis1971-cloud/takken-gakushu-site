import { isTakkenAnswer, type TakkenAnswer, type TakkenSpecialScoring } from "./takkenAnswer";
import type { TakkenPracticeQuestion, TakkenPracticeYear } from "./takkenPractice";

export const TAKKEN_WRONG_QUESTIONS_STORAGE_KEY = "takken_wrong_questions_v1";

export type TakkenWrongQuestion = {
  id: string;
  examId: string;
  year: number;
  era_year: string;
  qnum: number;
  subject: string;
  topic: string;
  question: string;
  choices: string[];
  answer: TakkenAnswer;
  special_scoring?: TakkenSpecialScoring;
  selectedAnswer: number;
  is_exemption_question: boolean;
  savedAt: string;
};

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function getQuestionId(examId: string, qnum: number) {
  return `${examId}-${qnum}`;
}

function getQuestionExamId(question: Partial<TakkenWrongQuestion>) {
  if (typeof question.examId === "string") {
    return question.examId;
  }

  if (typeof question.id === "string") {
    const [examId] = question.id.split("-");
    return examId;
  }

  return null;
}

function isWrongQuestion(value: unknown): value is TakkenWrongQuestion {
  if (!value || typeof value !== "object") {
    return false;
  }

  const question = value as Partial<TakkenWrongQuestion>;

  return (
    typeof question.id === "string" &&
    getQuestionExamId(question) !== null &&
    typeof question.year === "number" &&
    typeof question.era_year === "string" &&
    typeof question.qnum === "number" &&
    typeof question.subject === "string" &&
    typeof question.topic === "string" &&
    typeof question.question === "string" &&
    Array.isArray(question.choices) &&
    question.choices.every((choice) => typeof choice === "string") &&
    isTakkenAnswer(question.answer) &&
    (question.special_scoring === undefined || typeof question.special_scoring === "string") &&
    typeof question.selectedAnswer === "number" &&
    typeof question.is_exemption_question === "boolean" &&
    typeof question.savedAt === "string"
  );
}

function normalizeWrongQuestion(question: TakkenWrongQuestion): TakkenWrongQuestion {
  return {
    ...question,
    examId: getQuestionExamId(question) ?? String(question.year),
  };
}

function sortWrongQuestions(questions: TakkenWrongQuestion[]) {
  return [...questions].sort((current, next) => {
    if (current.year !== next.year) {
      return next.year - current.year;
    }

    if (current.examId !== next.examId) {
      return current.examId.localeCompare(next.examId);
    }

    if (current.qnum !== next.qnum) {
      return current.qnum - next.qnum;
    }

    return current.savedAt.localeCompare(next.savedAt);
  });
}

export function readWrongQuestions(): TakkenWrongQuestion[] {
  if (!isBrowser()) {
    return [];
  }

  const storedValue = window.localStorage.getItem(TAKKEN_WRONG_QUESTIONS_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return sortWrongQuestions(parsedValue.filter(isWrongQuestion).map(normalizeWrongQuestion));
  } catch {
    return [];
  }
}

function writeWrongQuestions(questions: TakkenWrongQuestion[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(TAKKEN_WRONG_QUESTIONS_STORAGE_KEY, JSON.stringify(sortWrongQuestions(questions)));
}

export function saveWrongQuestion(
  year: Pick<TakkenPracticeYear, "era" | "examId" | "year">,
  question: TakkenPracticeQuestion,
  selectedAnswer: number,
) {
  const savedQuestion: TakkenWrongQuestion = {
    id: getQuestionId(question.examId, question.qnum),
    examId: question.examId,
    year: year.year,
    era_year: year.era,
    qnum: question.qnum,
    subject: question.subject,
    topic: question.topic,
    question: question.question,
    choices: question.choices,
    answer: question.answer,
    special_scoring: question.specialScoring,
    selectedAnswer,
    is_exemption_question: question.isExemptionQuestion,
    savedAt: new Date().toISOString(),
  };

  const otherQuestions = readWrongQuestions().filter((wrongQuestion) => wrongQuestion.id !== savedQuestion.id);
  writeWrongQuestions([...otherQuestions, savedQuestion]);
}

export function removeWrongQuestion(questionId: string) {
  writeWrongQuestions(readWrongQuestions().filter((wrongQuestion) => wrongQuestion.id !== questionId));
}

export function updateWrongQuestionAnswer(questionId: string, selectedAnswer: number) {
  const questions = readWrongQuestions().map((wrongQuestion) => {
    if (wrongQuestion.id !== questionId) {
      return wrongQuestion;
    }

    return {
      ...wrongQuestion,
      selectedAnswer,
      savedAt: new Date().toISOString(),
    };
  });

  writeWrongQuestions(questions);
}

export function clearWrongQuestions() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(TAKKEN_WRONG_QUESTIONS_STORAGE_KEY);
}
