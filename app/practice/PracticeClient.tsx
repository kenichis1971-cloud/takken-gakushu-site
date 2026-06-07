"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  formatCorrectAnswer,
  getCorrectAnswerChoiceText,
  isCorrectAnswer,
  isCorrectChoice,
} from "../../lib/takkenAnswer";
import { saveWrongQuestion } from "../../lib/takkenReviewStorage";
import {
  clearSeenQuestions,
  getSeenQuestionMap,
  getSeenStats,
  pickQuestionsWithUnseenPriority,
  saveSeenQuestions,
  type TakkenSeenQuestionMap,
} from "../../lib/takkenSeenStorage";
import type { TakkenPracticeQuestion, TakkenPracticeYear } from "../../lib/takkenPractice";

const RANDOM_PRACTICE_QUESTION_COUNT = 50;

type PracticeClientProps = {
  practiceYears: TakkenPracticeYear[];
};

type AnswerRecord = {
  qnum: number;
  selectedChoice: number;
  isCorrect: boolean;
};

type PracticeSession = {
  mode: "year" | "random";
  title: string;
  resultLabel: string;
  questionCount: number;
  sourceQuestionCount: number;
  questions: TakkenPracticeQuestion[];
  year?: TakkenPracticeYear;
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
  const [selectedSession, setSelectedSession] = useState<PracticeSession | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [seenQuestionMap, setSeenQuestionMap] = useState<TakkenSeenQuestionMap>({});
  const [isSeenQuestionMapLoaded, setIsSeenQuestionMapLoaded] = useState(false);

  const allPracticeQuestions = useMemo(
    () => practiceYears.flatMap((year) => year.questions),
    [practiceYears],
  );
  const randomQuestionCount = Math.min(RANDOM_PRACTICE_QUESTION_COUNT, allPracticeQuestions.length);
  const seenStats = useMemo(
    () => getSeenStats(allPracticeQuestions, seenQuestionMap),
    [allPracticeQuestions, seenQuestionMap],
  );
  const currentQuestion = selectedSession?.questions[questionIndex] ?? null;
  const correctCount = useMemo(
    () => answerRecords.filter((record) => record.isCorrect).length,
    [answerRecords],
  );
  const wrongCount = answerRecords.length - correctCount;

  useEffect(() => {
    setSeenQuestionMap(getSeenQuestionMap());
    setIsSeenQuestionMapLoaded(true);
  }, []);

  function resetSession(session: PracticeSession) {
    setSelectedSession(session);
    setQuestionIndex(0);
    setSelectedChoice(null);
    setAnswerRecords([]);
    setIsFinished(false);
  }

  function startPractice(year: TakkenPracticeYear) {
    resetSession({
      mode: "year",
      title: year.era,
      resultLabel: `${year.era} / ${year.year}年`,
      questionCount: year.questionCount,
      sourceQuestionCount: year.questionCount,
      questions: year.questions,
      year,
    });
  }

  function startRandomPractice() {
    const currentSeenMap = getSeenQuestionMap();
    const questions = pickQuestionsWithUnseenPriority(allPracticeQuestions, randomQuestionCount, currentSeenMap);
    const nextSeenMap = saveSeenQuestions(questions, "random50");

    setSeenQuestionMap(nextSeenMap);

    resetSession({
      mode: "random",
      title: "全年度ランダム50問",
      resultLabel: "全年度ランダム50問",
      questionCount: questions.length,
      sourceQuestionCount: allPracticeQuestions.length,
      questions,
    });
  }

  function restartCurrentSession() {
    if (!selectedSession) {
      return;
    }

    if (selectedSession.mode === "random") {
      startRandomPractice();
      return;
    }

    if (selectedSession.year) {
      startPractice(selectedSession.year);
    }
  }

  function resetSeenQuestionHistory() {
    clearSeenQuestions();
    setSeenQuestionMap({});
    setIsSeenQuestionMapLoaded(true);
  }

  function returnToYearSelection() {
    setSelectedSession(null);
    setQuestionIndex(0);
    setSelectedChoice(null);
    setAnswerRecords([]);
    setIsFinished(false);
  }

  function answerQuestion(question: TakkenPracticeQuestion, choiceNumber: number) {
    if (selectedChoice !== null) {
      return;
    }

    const isCorrect = isCorrectAnswer(choiceNumber, question.answer, question.specialScoring);

    setSelectedChoice(choiceNumber);

    if (!isCorrect) {
      saveWrongQuestion({ era: question.era, examId: question.examId, year: question.year }, question, choiceNumber);
    }

    setAnswerRecords((records) => [
      ...records,
      {
        qnum: question.qnum,
        selectedChoice: choiceNumber,
        isCorrect,
      },
    ]);
  }

  function goToNextQuestion() {
    if (!selectedSession) {
      return;
    }

    if (questionIndex >= selectedSession.questions.length - 1) {
      setIsFinished(true);
      return;
    }

    setQuestionIndex((index) => index + 1);
    setSelectedChoice(null);
  }

  if (!selectedSession) {
    return (
      <article className="container practice-page">
        <div className="practice-hero">
          <div>
            <p className="eyebrow">Practice</p>
            <h1>宅建過去問演習</h1>
            <p>
              11試験回分の過去問を問1から問50まで順番に解くか、収録済み550問からランダム50問を解けます。
            </p>
          </div>
          <span className="status-badge">年度別順番演習 / ランダム演習</span>
        </div>

        <section className="section-block" aria-labelledby="practice-random-heading">
          <div className="section-heading compact-heading">
            <p className="eyebrow">Random mode</p>
            <h2 id="practice-random-heading">全年度ランダム演習</h2>
          </div>

          <section className="card practice-random-card">
            <div className="practice-year-card-header">
              <h3>全年度ランダム50問</h3>
              <span>収録済み{allPracticeQuestions.length}問</span>
            </div>
            <p>収録済み{allPracticeQuestions.length}問から、まだ出ていない問題を優先して50問出題します。</p>
            <p>年度をまたいで実戦形式で確認できます。</p>
            <dl className="seen-question-stats" aria-label="出題済み履歴">
              <div>
                <dt>出題済み</dt>
                <dd>
                  {isSeenQuestionMapLoaded ? `${seenStats.seenCount}問 / ${seenStats.totalCount}問` : "確認中"}
                </dd>
              </div>
              <div>
                <dt>未出題</dt>
                <dd>{isSeenQuestionMapLoaded ? `${seenStats.unseenCount}問` : "確認中"}</dd>
              </div>
            </dl>
            <div className="practice-card-actions">
              <button className="button button-secondary" type="button" onClick={resetSeenQuestionHistory}>
                出題済み履歴をリセット
              </button>
            </div>
            <button
              className="button button-primary practice-start-button"
              type="button"
              onClick={startRandomPractice}
            >
              全年度ランダム50問を解く
            </button>
          </section>
        </section>

        <section className="section-block" aria-labelledby="practice-year-heading">
          <div className="section-heading compact-heading">
            <p className="eyebrow">Select year</p>
            <h2 id="practice-year-heading">年度選択</h2>
          </div>

          <div className="practice-year-grid">
            {practiceYears.map((year) => (
              <section className="card practice-year-card" key={year.examId}>
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
              <dt>演習モード</dt>
              <dd>{selectedSession.resultLabel}</dd>
            </div>
            {selectedSession.mode === "random" ? (
              <div>
                <dt>抽出元</dt>
                <dd>収録済み{selectedSession.sourceQuestionCount}問</dd>
              </div>
            ) : null}
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
            <button className="button button-secondary" type="button" onClick={restartCurrentSession}>
              {selectedSession.mode === "random" ? "もう一度ランダム50問を解く" : "同じ年度をもう一度解く"}
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
  const isCorrect =
    selectedChoice !== null && isCorrectAnswer(selectedChoice, currentQuestion.answer, currentQuestion.specialScoring);
  const answerChoiceText = getCorrectAnswerChoiceText(currentQuestion.choices, currentQuestion.answer);
  const formattedAnswer = formatCorrectAnswer(currentQuestion.answer, currentQuestion.specialScoring);

  return (
    <article className="container practice-page">
      <div className="practice-question-header">
        <div>
          <p className="eyebrow">Question</p>
          <h1>
            {selectedSession.title} 問{currentQuestion.qnum}
          </h1>
          <p>
            進捗：{questionIndex + 1} / {selectedSession.questionCount}
          </p>
        </div>
        <button className="button button-secondary" type="button" onClick={returnToYearSelection}>
          年度選択に戻る
        </button>
      </div>

      <section className="card practice-question-card" aria-labelledby="practice-question-heading">
        <div className="practice-meta-row">
          <span>{currentQuestion.era}</span>
          <span>問{currentQuestion.qnum}</span>
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
            const isAnswer = isCorrectChoice(choiceNumber, currentQuestion.answer, currentQuestion.specialScoring);
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
              正解番号：{formattedAnswer} / {answerChoiceText}
            </p>
            <button className="button button-primary" type="button" onClick={goToNextQuestion}>
              {questionIndex >= selectedSession.questions.length - 1 ? "結果を見る" : "次の問題へ"}
            </button>
          </div>
        ) : null}
      </section>
    </article>
  );
}
