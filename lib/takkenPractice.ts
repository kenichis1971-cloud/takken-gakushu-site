import questions2017 from "../data/takken/past/2017_questions.json";
import questions2018 from "../data/takken/past/2018_questions.json";
import questions2019 from "../data/takken/past/2019_questions.json";
import questions2020_10 from "../data/takken/past/2020_10_questions.json";
import questions2020_12 from "../data/takken/past/2020_12_questions.json";
import questions2021_10 from "../data/takken/past/2021_10_questions.json";
import questions2021_12 from "../data/takken/past/2021_12_questions.json";
import questions2022 from "../data/takken/past/2022_questions.json";
import questions2023 from "../data/takken/past/2023_questions.json";
import questions2024 from "../data/takken/past/2024_questions.json";
import questions2025 from "../data/takken/past/2025_questions.json";
import type { TakkenAnswer, TakkenSpecialScoring } from "./takkenAnswer";

export type TakkenPracticeQuestion = {
  id: string;
  examId: string;
  year: number;
  era: string;
  qnum: number;
  subject: string;
  topic: string;
  question: string;
  choices: string[];
  answer: TakkenAnswer;
  specialScoring?: TakkenSpecialScoring;
  isExemptionQuestion: boolean;
};

export type TakkenPracticeYear = {
  examId: string;
  era: string;
  year: number;
  questionCount: number;
  questions: TakkenPracticeQuestion[];
};

type RawTakkenPracticeQuestion = {
  qnum: number;
  subject?: string;
  field?: string;
  topic?: string;
  question?: string;
  choices: string[];
  answer: TakkenAnswer;
  special_scoring?: TakkenSpecialScoring;
  is_exemption_question?: boolean;
};

type RawTakkenPracticeQuestionSet = {
  year: number;
  era?: string;
  era_year?: string;
  items: RawTakkenPracticeQuestion[];
};

type PracticeQuestionSource = {
  data: RawTakkenPracticeQuestionSet;
  examId: string;
  era: string;
};

const practiceQuestionSources: PracticeQuestionSource[] = [
  { data: questions2025, examId: "2025", era: "令和7年度" },
  { data: questions2024, examId: "2024", era: "令和6年度" },
  { data: questions2023, examId: "2023", era: "令和5年度" },
  { data: questions2022, examId: "2022", era: "令和4年度" },
  { data: questions2021_10, examId: "2021_10", era: "令和3年度10月" },
  { data: questions2021_12, examId: "2021_12", era: "令和3年度12月" },
  { data: questions2020_10, examId: "2020_10", era: "令和2年度10月" },
  { data: questions2020_12, examId: "2020_12", era: "令和2年度12月" },
  { data: questions2019, examId: "2019", era: "令和元年度" },
  { data: questions2018, examId: "2018", era: "平成30年度" },
  { data: questions2017, examId: "2017", era: "平成29年度" },
];

function normalizePracticeQuestion(
  question: RawTakkenPracticeQuestion,
  year: number,
  era: string,
  examId: string,
): TakkenPracticeQuestion {
  return {
    id: `${examId}-${question.qnum}`,
    examId,
    year,
    era,
    qnum: question.qnum,
    subject: question.subject ?? question.field ?? "未分類",
    topic: question.topic ?? "未分類",
    question: question.question || "問題文は収録データを確認中です。",
    choices: question.choices,
    answer: question.answer,
    specialScoring: question.special_scoring,
    isExemptionQuestion: question.is_exemption_question === true,
  };
}

export function getTakkenPracticeYears(): TakkenPracticeYear[] {
  return practiceQuestionSources.map(({ data, era, examId }) => {
    const displayEra = data.era ?? era;
    const questions = data.items
      .map((question) => normalizePracticeQuestion(question, data.year, displayEra, examId))
      .sort((current, next) => current.qnum - next.qnum);

    return {
      examId,
      era: displayEra,
      year: data.year,
      questionCount: questions.length,
      questions,
    };
  });
}
