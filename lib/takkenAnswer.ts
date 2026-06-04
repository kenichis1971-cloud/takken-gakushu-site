export type TakkenAnswer = number | number[];
export type TakkenSpecialScoring = "all_correct" | string;

function isChoiceNumber(value: number) {
  return Number.isInteger(value) && value >= 1 && value <= 4;
}

export function isTakkenAnswer(value: unknown): value is TakkenAnswer {
  if (typeof value === "number") {
    return isChoiceNumber(value);
  }

  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((answer) => typeof answer === "number" && isChoiceNumber(answer))
  );
}

export function isCorrectAnswer(
  selectedAnswer: number,
  answer: TakkenAnswer,
  specialScoring?: TakkenSpecialScoring,
) {
  if (specialScoring === "all_correct") {
    return true;
  }

  if (Array.isArray(answer)) {
    return answer.includes(selectedAnswer);
  }

  return selectedAnswer === answer;
}

export function isCorrectChoice(
  choiceNumber: number,
  answer: TakkenAnswer,
  specialScoring?: TakkenSpecialScoring,
) {
  return isCorrectAnswer(choiceNumber, answer, specialScoring);
}

export function formatCorrectAnswer(answer: TakkenAnswer, specialScoring?: TakkenSpecialScoring) {
  if (!Array.isArray(answer)) {
    return String(answer);
  }

  if (specialScoring === "all_correct") {
    return answer.join("・");
  }

  if (answer.length === 2) {
    return answer.join("又は");
  }

  return answer.join("・");
}

export function getCorrectAnswerChoiceText(choices: string[], answer: TakkenAnswer) {
  const answerNumbers = Array.isArray(answer) ? answer : [answer];

  return answerNumbers
    .map((answerNumber) => choices[answerNumber - 1])
    .filter((choice): choice is string => Boolean(choice))
    .join(" / ");
}
