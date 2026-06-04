"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { saveWrongQuestion } from "../../lib/takkenReviewStorage";
import type { TakkenPracticeQuestion, TakkenPracticeYear } from "../../lib/takkenPractice";

type PracticeClientProps = {
  practiceYears: TakkenPracticeYear[];
};

type AnswerRecord = {
  qnum: number;
  selectedChoice: number;
  isCorrect: boolean;
};

function getChoiceLabel(index: number) {
  return String(index + 1);
}

function getAccuracy(correctCount: number, answerCount: number) {
  if (answerCount === 0) {
    return 0;
  }

  return Math.round((correctCount / answerCount) * 100);
}

export function PracticeClient({ practiceYears }: PracticeClientProps) {
  const [selectedYear, setSelectedYear] = useState<TakkenPracticeYear | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = selectedYear?.questions[questionIndex] ?? null;
  const correctCount = useMemo(
    () => answerRecords.filter((record) => record.isCorrect).length,
    [answerRecords],
  );
  const wrongCount = answerRecords.length - correctCount;

  function startPractice(year: TakkenPracticeYear) {
    setSelectedYear(year);
    setQuestionIndex(0);
    setSelectedChoice(null);
    setAnswerRecords([]);
    setIsFinished(false);
  }

  function returnToYearSelection() {
    setSelectedYear(null);
    setQuestionIndex(0);
    setSelectedChoice(null);
    setAnswerRecords([]);
    setIsFinished(false);
  }

  function answerQuestion(question: TakkenPracticeQuestion, choiceNumber: number) {
    if (selectedChoice !== null) {
      return;
    }

    setSelectedChoice(choiceNumber);

    if (selectedYear && choiceNumber !== question.answer) {
      saveWrongQuestion(selectedYear, question, choiceNumber);
    }

    setAnswerRecords((records) => [
      ...records,
      {
        qnum: question.qnum,
        selectedChoice: choiceNumber,
        isCorrect: choiceNumber === question.answer,
      },
    ]);
  }

  function goToNextQuestion() {
    if (!selectedYear) {
      return;
    }

    if (questionIndex >= selectedYear.questions.length - 1) {
      setIsFinished(true);
      return;
    }

    setQuestionIndex((index) => index + 1);
    setSelectedChoice(null);
  }

  if (!selectedYear) {
    return (
      <article className="container practice-page">
        <div className="practice-hero">
          <div>
            <p className="eyebrow">Practice</p>
            <h1>宅建過去問演習</h1>
            <p>
              年度を選んで、問1から問50まで順番に解けます。まずは演習する年度を選択してください。
            </p>
          </div>
          <span className="status-badge">年度別順番演習</span>
        </div>

        <section className="section-block" aria-labelledby="practice-year-heading">
          <div className="section-heading compact-heading">
            <p className="eyebrow">Select year</p>
            <h2 id="practice-year-heading">年度選択</h2>
          </div>

          <div className="practice-year-grid">
            {practiceYears.map((year) => (
              <section className="card practice-year-card" key={year.year}>
                <div className="practice-year-card-header">
                  <h3>{year.era}</h3>
                  <span>{year.year}年</span>
                </div>
                <p>{year.questionCount}問を qnum 順に表示します。</p>
                <button
                  className="button button-primary practice-start-button"
                  type="button"
                  onClick={() => startPractice(year)}
                >
                  {year.era}を解く
                </button>
              </section>
            ))}
          </div>
        </section>
      </article>
    );
  }

  if (isFinished) {
    const answerCount = answerRecords.length;
    const accuracy = getAccuracy(correctCount, answerCount);

    return (
      <article className="container practice-page">
        <section className="card practice-result" aria-labelledby="practice-result-heading">
          <p className="eyebrow">Result</p>
          <h1 id="practice-result-heading">演習結果</h1>
          <dl className="practice-result-list">
            <div>
              <dt>演習年度</dt>
              <dd>
                {selectedYear.era} / {selectedYear.year}年
              </dd>
            </div>
            <div>
              <dt>解答数</dt>
              <dd>{answerCount}問</dd>
            </div>
            <div>
              <dt>正解数</dt>
              <dd>{correctCount}問</dd>
            </div>
            <div>
              <dt>正答率</dt>
              <dd>{accuracy}%</dd>
            </div>
            <div>
              <dt>間違えた問題</dt>
              <dd>{wrongCount}問</dd>
            </div>
          </dl>
          <div className="action-row">
            {wrongCount > 0 ? (
              <Link className="button button-primary" href="/review">
                間違えた問題を復習する
              </Link>
            ) : null}
            <button className="button button-secondary" type="button" onClick={() => startPractice(selectedYear)}>
              同じ年度をもう一度解く
            </button>
            <button className="button button-secondary" type="button" onClick={returnToYearSelection}>
              年度選択に戻る
            </button>
          </div>
        </section>
      </article>
    );
  }

  if (!currentQuestion) {
    return (
      <article className="container practice-page">
        <section className="card practice-result">
          <h1>問題を表示できませんでした</h1>
          <p>年度選択に戻って、もう一度選択してください。</p>
          <button className="button button-primary" type="button" onClick={returnToYearSelection}>
            年度選択に戻る
          </button>
        </section>
      </article>
    );
  }

  const isAnswered = selectedChoice !== null;
  const isCorrect = selectedChoice === currentQuestion.answer;
  const answerChoiceText = currentQuestion.choices[currentQuestion.answer - 1];

  return (
    <article className="container practice-page">
      <div className="practice-question-header">
        <div>
          <p className="eyebrow">Question</p>
          <h1>
            {selectedYear.era} 問{currentQuestion.qnum}
          </h1>
          <p>
            進捗：{questionIndex + 1} / {selectedYear.questionCount}
          </p>
        </div>
        <button className="button button-secondary" type="button" onClick={returnToYearSelection}>
          年度選択に戻る
        </button>
      </div>

      <section className="card practice-question-card" aria-labelledby="practice-question-heading">
        <div className="practice-meta-row">
          <span>{currentQuestion.subject}</span>
          <span>{currentQuestion.topic}</span>
          {currentQuestion.isExemptionQuestion ? <span>登録講習免除対象問</span> : null}
        </div>
        <h2 id="practice-question-heading">問題文</h2>
        <p className="practice-question-text">{currentQuestion.question}</p>

        <div className="practice-choice-list" aria-label="選択肢">
          {currentQuestion.choices.map((choice, index) => {
            const choiceNumber = index + 1;
            const isSelected = selectedChoice === choiceNumber;
            const isAnswer = currentQuestion.answer === choiceNumber;
            const resultClass = isAnswered
              ? isAnswer
                ? " practice-choice-correct"
                : isSelected
                  ? " practice-choice-incorrect"
                  : ""
              : "";

            return (
              <button
                className={`practice-choice-button${isSelected ? " practice-choice-selected" : ""}${resultClass}`}
                disabled={isAnswered}
                key={choiceNumber}
                type="button"
                onClick={() => answerQuestion(currentQuestion, choiceNumber)}
              >
                <span className="practice-choice-number">{getChoiceLabel(index)}</span>
                <span>{choice}</span>
              </button>
            );
          })}
        </div>

        {isAnswered ? (
          <div
            className={`practice-answer-box ${
              isCorrect ? "practice-answer-correct" : "practice-answer-incorrect"
            }`}
          >
            <p className="practice-answer-title">{isCorrect ? "正解" : "不正解"}</p>
            <p>
              正解番号：{currentQuestion.answer} / {answerChoiceText}
            </p>
            <button className="button button-primary" type="button" onClick={goToNextQuestion}>
              {questionIndex >= selectedYear.questions.length - 1 ? "結果を見る" : "次の問題へ"}
            </button>
          </div>
        ) : null}
      </section>
    </article>
  );
}
