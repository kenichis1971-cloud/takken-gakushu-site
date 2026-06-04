import questions2023 from "../data/takken/past/2023_questions.json";
import questions2024 from "../data/takken/past/2024_questions.json";
import questions2025 from "../data/takken/past/2025_questions.json";

type TakkenPastQuestion = {
  qnum: number;
  is_exemption_question?: boolean;
};

type TakkenPastQuestionSet = {
  year: number;
  era?: string;
  exam?: string;
  items: TakkenPastQuestion[];
};

type PastQuestionSource = {
  data: TakkenPastQuestionSet;
  era: string;
};

export type TakkenPastQuestionSummary = {
  era: string;
  year: number;
  questionCount: number;
  hasExemptionQuestions: boolean;
};

export type TakkenPastQuestionTotals = {
  yearCount: number;
  questionCount: number;
};

const pastQuestionSources: PastQuestionSource[] = [
  { data: questions2025, era: "令和7年度" },
  { data: questions2024, era: "令和6年度" },
  { data: questions2023, era: "令和5年度" },
];

export function getTakkenPastQuestionSummaries(): TakkenPastQuestionSummary[] {
  return pastQuestionSources.map(({ data, era }) => {
    const exemptionQuestions = data.items.filter((item) => item.qnum >= 46 && item.qnum <= 50);

    return {
      era: data.era ?? era,
      year: data.year,
      questionCount: data.items.length,
      hasExemptionQuestions:
        exemptionQuestions.length === 5 && exemptionQuestions.every((item) => item.is_exemption_question === true),
    };
  });
}

export function getTakkenPastQuestionTotals(
  summaries = getTakkenPastQuestionSummaries(),
): TakkenPastQuestionTotals {
  return {
    yearCount: summaries.length,
    questionCount: summaries.reduce((total, summary) => total + summary.questionCount, 0),
  };
}
