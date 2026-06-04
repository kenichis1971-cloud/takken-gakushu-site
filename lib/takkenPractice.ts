import questions2023 from "../data/takken/past/2023_questions.json";
import questions2024 from "../data/takken/past/2024_questions.json";
import questions2025 from "../data/takken/past/2025_questions.json";

export type TakkenPracticeQuestion = {
  year: number;
  era: string;
  qnum: number;
  subject: string;
  topic: string;
  question: string;
  choices: string[];
  answer: number;
  isExemptionQuestion: boolean;
};

export type TakkenPracticeYear = {
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
  question: string;
  choices: string[];
  answer: number;
  is_exemption_question?: boolean;
};

type RawTakkenPracticeQuestionSet = {
  year: number;
  era?: string;
  items: RawTakkenPracticeQuestion[];
};

type PracticeQuestionSource = {
  data: RawTakkenPracticeQuestionSet;
  era: string;
};

const practiceQuestionSources: PracticeQuestionSource[] = [
  { data: questions2025, era: "令和7年度" },
  { data: questions2024, era: "令和6年度" },
  { data: questions2023, era: "令和5年度" },
];

function normalizePracticeQuestion(
  question: RawTakkenPracticeQuestion,
  year: number,
  era: string,
): TakkenPracticeQuestion {
  return {
    year,
    era,
    qnum: question.qnum,
    subject: question.subject ?? question.field ?? "未分類",
    topic: question.topic ?? "未分類",
    question: question.question,
    choices: question.choices,
    answer: question.answer,
    isExemptionQuestion: question.is_exemption_question === true,
  };
}

export function getTakkenPracticeYears(): TakkenPracticeYear[] {
  return practiceQuestionSources.map(({ data, era }) => {
    const questions = data.items
      .map((question) => normalizePracticeQuestion(question, data.year, data.era ?? era))
      .sort((current, next) => current.qnum - next.qnum);

    return {
      era: data.era ?? era,
      year: data.year,
      questionCount: questions.length,
      questions,
    };
  });
}
