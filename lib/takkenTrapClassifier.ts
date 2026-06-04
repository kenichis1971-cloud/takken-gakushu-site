import type { TakkenPracticeQuestion } from "./takkenPractice";

export type TakkenTrapType = "mixed" | "correctness" | "possibility" | "requirement" | "exception" | "number";

type TrapDefinition = {
  id: Exclude<TakkenTrapType, "mixed">;
  name: string;
  description: string;
  keywords: string[];
};

export type TakkenTrapTag = {
  type: Exclude<TakkenTrapType, "mixed">;
  name: string;
  matchedKeywords: string[];
};

export type TakkenTrapGroup = {
  id: TakkenTrapType;
  name: string;
  description: string;
  questions: TakkenPracticeQuestion[];
};

export const TRAP_QUESTION_COUNT = 10;

export const TAKKEN_TRAP_DEFINITIONS: TrapDefinition[] = [
  {
    id: "correctness",
    name: "正しいもの・誤っているもの",
    description: "正誤・適否・妥当性を問う表現を含む問題を集めます。",
    keywords: ["正しいもの", "誤っているもの", "適切なもの", "不適切なもの", "妥当なもの", "妥当でないもの"],
  },
  {
    id: "possibility",
    name: "できる・できない",
    description: "できる／できない、認められる／許されるなどの判断表現に慣れます。",
    keywords: [
      "することができない",
      "することができる",
      "できない",
      "できる",
      "認められない",
      "認められる",
      "許されない",
      "許される",
    ],
  },
  {
    id: "requirement",
    name: "要する・不要",
    description: "必要・不要、義務・免除など、条件の有無を問う表現を確認します。",
    keywords: [
      "しなければならない",
      "しなくてもよい",
      "要しない",
      "要する",
      "必要",
      "不要",
      "義務",
      "免除",
    ],
  },
  {
    id: "exception",
    name: "例外・ただし・制限",
    description: "ただし書き、例外、制限、別段の定めなどを含む問題を集めます。",
    keywords: [
      "ただし",
      "例外",
      "除く",
      "制限",
      "原則",
      "特別の定め",
      "別段の定め",
      "場合に限り",
      "かかわらず",
    ],
  },
  {
    id: "number",
    name: "数字・期間・期限",
    description: "日数・月数・期限・以上以下など、数字や期間に関係する表現を確認します。",
    keywords: ["日以内", "月以内", "年以内", "週間", "期間", "期限", "以上", "以下", "未満", "超える", "以内"],
  },
];

const MIXED_TRAP_GROUP: Omit<TakkenTrapGroup, "questions"> = {
  id: "mixed",
  name: "ひっかけミックス",
  description: "キーワードに該当した問題を横断してランダムに演習します。",
};

function getTrapSearchText(question: TakkenPracticeQuestion) {
  return [question.question, ...question.choices].join("\n");
}

function getUniqueQuestions(questions: TakkenPracticeQuestion[]) {
  return Array.from(new Map(questions.map((question) => [question.id, question])).values());
}

export function getTrapTags(question: TakkenPracticeQuestion): TakkenTrapTag[] {
  const searchText = getTrapSearchText(question);

  return TAKKEN_TRAP_DEFINITIONS.map((definition) => {
    const matchedKeywords = definition.keywords.filter((keyword) => searchText.includes(keyword));

    if (matchedKeywords.length === 0) {
      return null;
    }

    return {
      type: definition.id,
      name: definition.name,
      matchedKeywords,
    };
  }).filter((tag): tag is TakkenTrapTag => tag !== null);
}

export function getTrapQuestionPool(questions: TakkenPracticeQuestion[], trapType: TakkenTrapType) {
  const uniqueQuestions = getUniqueQuestions(questions);

  if (trapType === "mixed") {
    return uniqueQuestions.filter((question) => getTrapTags(question).length > 0);
  }

  return uniqueQuestions.filter((question) => getTrapTags(question).some((tag) => tag.type === trapType));
}

export function getTrapGroups(questions: TakkenPracticeQuestion[]): TakkenTrapGroup[] {
  const mixedQuestions = getTrapQuestionPool(questions, "mixed");
  const groupedQuestions = TAKKEN_TRAP_DEFINITIONS.map((definition) => ({
    id: definition.id,
    name: definition.name,
    description: definition.description,
    questions: getTrapQuestionPool(questions, definition.id),
  }));

  return [
    {
      ...MIXED_TRAP_GROUP,
      questions: mixedQuestions,
    },
    ...groupedQuestions,
  ];
}
