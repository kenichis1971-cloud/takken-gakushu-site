type QuestionLike = {
  question?: string;
  choices?: string[];
};

const PLACEHOLDER_CHOICE_PATTERN = /^選択肢[1-5]（(?:令和|平成).+年度(?:10月|12月)? 問\d+）$/;
const GENERIC_OFFICIAL_QUESTION_PATTERN = /(?:令和|平成).+年度宅地建物取引(?:士|主任者)資格試験 問\d+（公式PDF確認済み過去問）/;

export const NO_AVAILABLE_QUESTIONS_MESSAGE = "現在、この条件で出題できる問題はありません。";

function getPlaceholderChoiceCount(choices: string[] | undefined) {
  if (!choices) {
    return 0;
  }

  return choices.filter((choice) => PLACEHOLDER_CHOICE_PATTERN.test(choice)).length;
}

export function isPlaceholderQuestion(question: QuestionLike) {
  const placeholderChoiceCount = getPlaceholderChoiceCount(question.choices);

  if (placeholderChoiceCount >= 2) {
    return true;
  }

  return Boolean(question.question && GENERIC_OFFICIAL_QUESTION_PATTERN.test(question.question) && placeholderChoiceCount >= 1);
}
