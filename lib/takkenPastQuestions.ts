import questions2013 from "../data/takken/past/2013_questions.json";
import questions2014 from "../data/takken/past/2014_questions.json";
import questions2015 from "../data/takken/past/2015_questions.json";
import questions2016 from "../data/takken/past/2016_questions.json";
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
  examId: string;
  era: string;
};

export type TakkenPastQuestionSummary = {
  examId: string;
  era: string;
  year: number;
  questionCount: number;
  hasExemptionQuestions: boolean;
};

export type TakkenPastQuestionTotals = {
  examCount: number;
  questionCount: number;
};

const pastQuestionSources: PastQuestionSource[] = [
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
  { data: questions2016, examId: "2016", era: "平成28年度" },
  { data: questions2015, examId: "2015", era: "平成27年度" },
  { data: questions2014, examId: "2014", era: "平成26年度" },
  { data: questions2013, examId: "2013", era: "平成25年度" },
];

export function getTakkenPastQuestionSummaries(): TakkenPastQuestionSummary[] {
  return pastQuestionSources.map(({ data, era, examId }) => {
    const exemptionQuestions = data.items.filter((item) => item.qnum >= 46 && item.qnum <= 50);

    return {
      examId,
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
    examCount: summaries.length,
    questionCount: summaries.reduce((total, summary) => total + summary.questionCount, 0),
  };
}
