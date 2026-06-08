"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatCorrectAnswer,
  getCorrectAnswerChoiceText,
  isCorrectAnswer,
  isCorrectChoice,
} from "../../lib/takkenAnswer";
import {
  clearWrongQuestions,
  readWrongQuestions,
  removeWrongQuestion,
  TAKKEN_WRONG_QUESTIONS_STORAGE_KEY,
  type TakkenWrongQuestion,
  updateWrongQuestionAnswer,
} from "../../lib/takkenReviewStorage";

type ReviewAnswerRecord = {
  id: string;
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

export function ReviewClient() {
  const [wrongQuestions, setWrongQuestions] = useState<TakkenWrongQuestion[]>(
    [],
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewQuestions, setReviewQuestions] = useState<TakkenWrongQuestion[]>(
    [],
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerRecords, setAnswerRecords] = useState<ReviewAnswerRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = reviewQuestions[questionIndex] ?? null;
  const correctCount = useMemo(
    () => answerRecords.filter((record) => record.isCorrect).length,
    [answerRecords],
  );

  function refreshWrongQuestions() {
    setWrongQuestions(readWrongQuestions());
  }

  useEffect(() => {
    refreshWrongQuestions();
    setIsLoaded(true);
  }, []);

  function startReview() {
    const storedQuestions = readWrongQuestions();

    setWrongQuestions(storedQuestions);
    setReviewQuestions(storedQuestions);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswerRecords([]);
    setIsFinished(false);
    setIsReviewing(storedQuestions.length > 0);
  }

  function returnToList() {
    refreshWrongQuestions();
    setIsReviewing(false);
    setReviewQuestions([]);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswerRecords([]);
    setIsFinished(false);
  }

  function clearSavedQuestions() {
    clearWrongQuestions();
    returnToList();
  }

  function answerQuestion(question: TakkenWrongQuestion, choiceNumber: number) {
    if (selectedAnswer !== null) {
      return;
    }

    const isCorrect = isCorrectAnswer(
      choiceNumber,
      question.answer,
      question.special_scoring,
    );
    setSelectedAnswer(choiceNumber);
    setAnswerRecords((records) => [...records, { id: question.id, isCorrect }]);

    if (isCorrect) {
      removeWrongQuestion(question.id);
      setWrongQuestions((questions) =>
        questions.filter((wrongQuestion) => wrongQuestion.id !== question.id),
      );
      return;
    }

    updateWrongQuestionAnswer(question.id, choiceNumber);
    refreshWrongQuestions();
  }

  function goToNextQuestion() {
    if (questionIndex >= reviewQuestions.length - 1) {
      setIsFinished(true);
      return;
    }

    setQuestionIndex((index) => index + 1);
    setSelectedAnswer(null);
  }

  if (isReviewing && isFinished) {
    const answerCount = answerRecords.length;
    const accuracy = getAccuracy(correctCount, answerCount);
    const remainingCount = wrongQuestions.length;

    return (
      <article className="container practice-page review-page">
        <section
          className="card practice-result"
          aria-labelledby="review-result-heading"
        >
          <p className="eyebrow">Review result</p>
          <h1 id="review-result-heading">復習演習の結果</h1>
          <dl className="practice-result-list">
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
              <dt>保存中の間違い</dt>
              <dd>{remainingCount}問</dd>
            </div>
          </dl>
          <div className="action-row">
            {remainingCount > 0 ? (
              <button
                className="button button-primary"
                type="button"
                onClick={startReview}
              >
                残りをもう一度復習する
              </button>
            ) : null}
            <button
              className="button button-secondary"
              type="button"
              onClick={returnToList}
            >
              復習一覧へ戻る
            </button>
          </div>
        </section>
      </article>
    );
  }

  if (isReviewing && currentQuestion) {
    const isAnswered = selectedAnswer !== null;
    const isCorrect =
      selectedAnswer !== null &&
      isCorrectAnswer(
        selectedAnswer,
        currentQuestion.answer,
        currentQuestion.special_scoring,
      );
    const answerChoiceText = getCorrectAnswerChoiceText(
      currentQuestion.choices,
      currentQuestion.answer,
    );
    const formattedAnswer = formatCorrectAnswer(
      currentQuestion.answer,
      currentQuestion.special_scoring,
    );

    return (
      <article className="container practice-page review-page">
        <div className="practice-question-header">
          <div>
            <p className="eyebrow">Review question</p>
            <h1>
              {currentQuestion.era_year} 問{currentQuestion.qnum}
            </h1>
            <p>
              進捗：{questionIndex + 1} / {reviewQuestions.length}
            </p>
          </div>
          <button
            className="button button-secondary"
            type="button"
            onClick={returnToList}
          >
            復習一覧へ戻る
          </button>
        </div>

        <section
          className="card practice-question-card"
          aria-labelledby="review-question-heading"
        >
          <div className="practice-meta-row">
            <span>{currentQuestion.subject}</span>
            <span>{currentQuestion.topic}</span>
            {currentQuestion.is_exemption_question ? (
              <span>登録講習免除対象問</span>
            ) : null}
          </div>
          <h2 id="review-question-heading">問題文</h2>
          <p className="practice-question-text">{currentQuestion.question}</p>

          <div className="practice-choice-list" aria-label="選択肢">
            {currentQuestion.choices.map((choice, index) => {
              const choiceNumber = index + 1;
              const isSelected = selectedAnswer === choiceNumber;
              const isAnswer = isCorrectChoice(
                choiceNumber,
                currentQuestion.answer,
                currentQuestion.special_scoring,
              );
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
                  <span className="practice-choice-number">
                    {getChoiceLabel(index)}
                  </span>
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>

          {isAnswered ? (
            <div
              className={`practice-answer-box ${
                isCorrect
                  ? "practice-answer-correct"
                  : "practice-answer-incorrect"
              }`}
            >
              <p className="practice-answer-title">
                {isCorrect ? "正解" : "不正解"}
              </p>
              <p>
                正解番号：{formattedAnswer} / {answerChoiceText}
              </p>
              <button
                className="button button-primary"
                type="button"
                onClick={goToNextQuestion}
              >
                {questionIndex >= reviewQuestions.length - 1
                  ? "結果を見る"
                  : "次の問題へ"}
              </button>
            </div>
          ) : null}
        </section>
      </article>
    );
  }

  return (
    <article className="practice-page practice-hero-page practice-hero-review review-page">
      <section className="practice-hero" aria-labelledby="review-page-heading">
        <div className="container practice-hero-inner">
          <div>
            <p className="eyebrow">Review</p>
            <h1 id="review-page-heading">間違えた問題の復習</h1>
            <p>
              通常演習で間違えた問題をこの端末のブラウザに保存し、後から解き直せます。
            </p>
          </div>
          <span className="status-badge">
            保存件数：{isLoaded ? wrongQuestions.length : "確認中"}件
          </span>
        </div>
      </section>

      <div className="container practice-page-content">
        <section
          className="section-block"
          aria-labelledby="review-list-heading"
        >
          <div className="section-heading compact-heading">
            <p className="eyebrow">Saved questions</p>
            <h2 id="review-list-heading">間違えた問題一覧</h2>
            <p className="review-storage-note">
              localStorage key：{TAKKEN_WRONG_QUESTIONS_STORAGE_KEY}
            </p>
          </div>

          {wrongQuestions.length > 0 ? (
            <>
              <div className="action-row review-actions">
                <button
                  className="button button-primary"
                  type="button"
                  onClick={startReview}
                >
                  復習演習を始める
                </button>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={clearSavedQuestions}
                >
                  保存した間違いをすべて削除
                </button>
              </div>

              <div className="review-question-grid">
                {wrongQuestions.map((question) => (
                  <section
                    className="card review-question-card"
                    key={question.id}
                  >
                    <div className="review-card-header">
                      <h3>
                        {question.era_year} 問{question.qnum}
                      </h3>
                      <span>{question.year}年</span>
                    </div>
                    <div className="practice-meta-row">
                      <span>{question.subject}</span>
                      <span>{question.topic}</span>
                      {question.is_exemption_question ? (
                        <span>登録講習免除対象問</span>
                      ) : null}
                    </div>
                    <dl className="review-card-details">
                      <div>
                        <dt>自分が選んだ番号</dt>
                        <dd>{question.selectedAnswer}</dd>
                      </div>
                      <div>
                        <dt>正解番号</dt>
                        <dd>
                          {formatCorrectAnswer(
                            question.answer,
                            question.special_scoring,
                          )}
                        </dd>
                      </div>
                    </dl>
                  </section>
                ))}
              </div>
            </>
          ) : (
            <section className="card review-empty-card">
              <h3>保存された間違い問題はまだありません</h3>
              <p>
                /practice
                の年度別演習で不正解だった問題があると、ここに一覧表示されます。
                復習演習で正解した問題は保存一覧から削除されます。
              </p>
            </section>
          )}
        </section>
      </div>
    </article>
  );
}
