"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatCorrectAnswer,
  getCorrectAnswerChoiceText,
  isCorrectAnswer,
  isCorrectChoice,
} from "../../lib/takkenAnswer";
import type { TakkenPracticeQuestion, TakkenPracticeYear } from "../../lib/takkenPractice";
import { saveWrongQuestion } from "../../lib/takkenReviewStorage";
import {
  getTrapGroups,
  getTrapTags,
  TRAP_QUESTION_COUNT,
  type TakkenTrapGroup,
  type TakkenTrapType,
} from "../../lib/takkenTrapClassifier";
import {
  clearSeenQuestions,
  getSeenQuestionMap,
  getSeenStats,
  pickQuestionsWithUnseenPriority,
  saveSeenQuestions,
  type TakkenSeenQuestionMap,
} from "../../lib/takkenSeenStorage";

type TrapsClientProps = {
  practiceYears: TakkenPracticeYear[];
};

type AnswerRecord = {
  id: string;
  selectedChoice: number;
  isCorrect: boolean;
};

type TrapSession = {
  trapType: TakkenTrapType;
  trapTypeName: string;
  sourceQuestionCount: number;
  questions: TakkenPracticeQuestion[];
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

function getSessionQuestionCount(group: TakkenTrapGroup) {
  return Math.min(TRAP_QUESTION_COUNT, group.questions.length);
}

function formatTrapTagLabels(question: TakkenPracticeQuestion) {
  return getTrapTags(question).map((tag) => tag.name);
}

export function TrapsClient({ practiceYears }: TrapsClientProps) {
  const [selectedSession, setSelectedSession] = useState<TrapSession | null>(null);
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
  const trapGroups = useMemo(
    () => getTrapGroups(allPracticeQuestions).filter((group) => group.questions.length > 0),
    [allPracticeQuestions],
  );
  const currentQuestion = selectedSession?.questions[questionIndex] ?? null;
  const correctCount = useMemo(
    () => answerRecords.filter((record) => record.isCorrect).length,
    [answerRecords],
  );

  useEffect(() => {
    setSeenQuestionMap(getSeenQuestionMap());
    setIsSeenQuestionMapLoaded(true);
  }, []);

  function resetSession(session: TrapSession) {
    setSelectedSession(session);
    setQuestionIndex(0);
    setSelectedChoice(null);
    setAnswerRecords([]);
    setIsFinished(false);
  }

  function startTrapPractice(group: TakkenTrapGroup) {
    const currentSeenMap = getSeenQuestionMap();
    const questions = pickQuestionsWithUnseenPriority(group.questions, getSessionQuestionCount(group), currentSeenMap);
    const nextSeenMap = saveSeenQuestions(questions, "trap", undefined, group.id);

    setSeenQuestionMap(nextSeenMap);

    resetSession({
      trapType: group.id,
      trapTypeName: group.name,
      sourceQuestionCount: group.questions.length,
      questions,
    });
  }

  function restartCurrentSession() {
    if (!selectedSession) {
      return;
    }

    const group = trapGroups.find((trapGroup) => trapGroup.id === selectedSession.trapType);

    if (group) {
      startTrapPractice(group);
    }
  }

  function resetSeenQuestionHistory() {
    clearSeenQuestions();
    setSeenQuestionMap({});
    setIsSeenQuestionMapLoaded(true);
  }

  function returnToTrapSelection() {
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
        id: question.id,
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
      <article className="container practice-page traps-page">
        <div className="practice-hero">
          <div>
            <p className="eyebrow">Traps</p>
            <h1>ひっかけ問題演習</h1>
            <p>
              収録済み{allPracticeQuestions.length}問から、問題文・選択肢に含まれる表現をもとに、
              宅建で間違えやすい条件・例外・数字表現を含む問題を抽出します。
            </p>
          </div>
          <span className="status-badge">キーワード抽出・ランダム10問</span>
        </div>

        <section className="section-block" aria-labelledby="traps-select-heading">
          <div className="section-heading compact-heading traps-heading">
            <div>
              <p className="eyebrow">Select trap type</p>
              <h2 id="traps-select-heading">ひっかけタイプを選ぶ</h2>
              <p>0件のタイプは表示せず、対象問題があるカードだけを表示しています。</p>
            </div>
            <button className="button button-secondary" type="button" onClick={resetSeenQuestionHistory}>
              出題済み履歴をリセット
            </button>
          </div>

          <div className="practice-year-grid traps-grid">
            {trapGroups.map((group) => {
              const groupSeenStats = getSeenStats(group.questions, seenQuestionMap);
              const sessionQuestionCount = getSessionQuestionCount(group);

              return (
                <section className="card practice-year-card traps-card" key={group.id}>
                  <div className="practice-year-card-header">
                    <h3>{group.name}</h3>
                    <span>対象{group.questions.length}問</span>
                  </div>
                  <p>{group.description}</p>
                  <dl
                    className="seen-question-stats compact-seen-question-stats"
                    aria-label={`${group.name}の出題済み履歴`}
                  >
                    <div>
                      <dt>今回の出題数</dt>
                      <dd>{sessionQuestionCount}問</dd>
                    </div>
                    <div>
                      <dt>出題済み</dt>
                      <dd>{isSeenQuestionMapLoaded ? `${groupSeenStats.seenCount}問` : "確認中"}</dd>
                    </div>
                    <div>
                      <dt>未出題</dt>
                      <dd>{isSeenQuestionMapLoaded ? `${groupSeenStats.unseenCount}問` : "確認中"}</dd>
                    </div>
                  </dl>
                  <button
                    className="button button-primary practice-start-button"
                    disabled={group.questions.length === 0}
                    type="button"
                    onClick={() => startTrapPractice(group)}
                  >
                    このタイプを{sessionQuestionCount}問解く
                  </button>
                </section>
              );
            })}
          </div>
        </section>
      </article>
    );
  }

  if (isFinished) {
    const answerCount = answerRecords.length;
    const accuracy = getAccuracy(correctCount, answerCount);

    return (
      <article className="container practice-page traps-page">
        <section className="card practice-result" aria-labelledby="traps-result-heading">
          <p className="eyebrow">Result</p>
          <h1 id="traps-result-heading">ひっかけ問題演習結果</h1>
          <dl className="practice-result-list">
            <div>
              <dt>ひっかけタイプ</dt>
              <dd>{selectedSession.trapTypeName}</dd>
            </div>
            <div>
              <dt>抽出元</dt>
              <dd>対象{selectedSession.sourceQuestionCount}問</dd>
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
          </dl>
          <div className="action-row">
            <button className="button button-primary" type="button" onClick={restartCurrentSession}>
              同じタイプをもう一度解く
            </button>
            <button className="button button-secondary" type="button" onClick={returnToTrapSelection}>
              ひっかけ演習選択に戻る
            </button>
          </div>
        </section>
      </article>
    );
  }

  if (!currentQuestion) {
    return (
      <article className="container practice-page traps-page">
        <section className="card practice-result">
          <h1>問題を表示できませんでした</h1>
          <p>ひっかけ演習選択に戻って、もう一度選択してください。</p>
          <button className="button button-primary" type="button" onClick={returnToTrapSelection}>
            ひっかけ演習選択に戻る
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
  const trapTagLabels = formatTrapTagLabels(currentQuestion);

  return (
    <article className="container practice-page traps-page">
      <div className="practice-question-header">
        <div>
          <p className="eyebrow">ひっかけ問題演習</p>
          <h1>{selectedSession.trapTypeName}</h1>
          <p>
            進捗：{questionIndex + 1} / {selectedSession.questions.length}
          </p>
        </div>
        <button className="button button-secondary" type="button" onClick={returnToTrapSelection}>
          ひっかけ演習選択に戻る
        </button>
      </div>

      <section className="card practice-question-card" aria-labelledby="traps-question-heading">
        <div className="practice-meta-row">
          <span>{currentQuestion.era}</span>
          <span>{currentQuestion.year}年</span>
          <span>試験ID：{currentQuestion.examId}</span>
          <span>問{currentQuestion.qnum}</span>
          <span>{currentQuestion.subject}</span>
          <span>{currentQuestion.topic}</span>
          {trapTagLabels.map((label) => (
            <span className="trap-tag" key={label}>
              {label}
            </span>
          ))}
          {currentQuestion.isExemptionQuestion ? <span>登録講習免除対象問</span> : null}
        </div>
        <h2 id="traps-question-heading">問題文</h2>
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
