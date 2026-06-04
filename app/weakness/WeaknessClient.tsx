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
  clearSeenQuestions,
  getSeenQuestionMap,
  getSeenStats,
  pickQuestionsWithUnseenPriority,
  saveSeenQuestions,
  type TakkenSeenQuestionMap,
} from "../../lib/takkenSeenStorage";

const SUBJECT_QUESTION_COUNT = 10;

type SubjectGroupId = "rights" | "business" | "lawLimit" | "taxOther" | "exemption";

type SubjectGroup = {
  id: SubjectGroupId;
  name: string;
  description: string;
  questions: TakkenPracticeQuestion[];
};

type WeaknessClientProps = {
  practiceYears: TakkenPracticeYear[];
};

type AnswerRecord = {
  id: string;
  selectedChoice: number;
  isCorrect: boolean;
};

type SubjectSession = {
  groupId: SubjectGroupId;
  subjectName: string;
  sourceQuestionCount: number;
  questions: TakkenPracticeQuestion[];
};

const SUBJECT_GROUP_DEFINITIONS: Array<Omit<SubjectGroup, "questions">> = [
  {
    id: "rights",
    name: "権利関係",
    description: "民法・借地借家法・区分所有法などを中心に確認します。",
  },
  {
    id: "business",
    name: "宅建業法",
    description: "重要事項説明、37条書面、免許、報酬などを中心に確認します。",
  },
  {
    id: "lawLimit",
    name: "法令上の制限",
    description: "都市計画法、建築基準法、農地法などを中心に確認します。",
  },
  {
    id: "taxOther",
    name: "税・その他",
    description: "税、価格、統計、土地・建物などを中心に確認します。",
  },
  {
    id: "exemption",
    name: "登録講習免除対象問",
    description: "問46〜問50を中心に確認します。通常科目と重なる問題も含みます。",
  },
];

function getChoiceLabel(index: number) {
  return String(index + 1);
}

function getAccuracy(correctCount: number, answerCount: number) {
  if (answerCount === 0) {
    return 0;
  }

  return Math.round((correctCount / answerCount) * 100);
}

function getUniqueQuestions(questions: TakkenPracticeQuestion[]) {
  return Array.from(new Map(questions.map((question) => [question.id, question])).values());
}

function getRegularSubjectGroupId(question: TakkenPracticeQuestion): Exclude<SubjectGroupId, "exemption"> {
  const subject = question.subject;
  const topic = question.topic;
  const categoryText = `${subject} ${topic}`;

  if (categoryText.includes("権利関係")) {
    return "rights";
  }

  if (categoryText.includes("宅建業法") || categoryText.includes("宅地建物取引業法")) {
    return "business";
  }

  if (
    categoryText.includes("法令上の制限") ||
    categoryText.includes("法令制限") ||
    categoryText.includes("都市計画法") ||
    categoryText.includes("建築基準法") ||
    categoryText.includes("農地法") ||
    categoryText.includes("土地区画整理") ||
    categoryText.includes("国土利用計画法") ||
    categoryText.includes("宅地造成")
  ) {
    return "lawLimit";
  }

  return "taxOther";
}

function buildSubjectGroups(questions: TakkenPracticeQuestion[]): SubjectGroup[] {
  return SUBJECT_GROUP_DEFINITIONS.map((definition) => {
    const groupQuestions = questions.filter((question) => {
      if (definition.id === "exemption") {
        return question.isExemptionQuestion;
      }

      return getRegularSubjectGroupId(question) === definition.id;
    });

    return {
      ...definition,
      questions: getUniqueQuestions(groupQuestions),
    };
  });
}

export function WeaknessClient({ practiceYears }: WeaknessClientProps) {
  const [selectedSession, setSelectedSession] = useState<SubjectSession | null>(null);
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
  const subjectGroups = useMemo(() => buildSubjectGroups(allPracticeQuestions), [allPracticeQuestions]);
  const currentQuestion = selectedSession?.questions[questionIndex] ?? null;
  const correctCount = useMemo(
    () => answerRecords.filter((record) => record.isCorrect).length,
    [answerRecords],
  );

  useEffect(() => {
    setSeenQuestionMap(getSeenQuestionMap());
    setIsSeenQuestionMapLoaded(true);
  }, []);

  function resetSession(session: SubjectSession) {
    setSelectedSession(session);
    setQuestionIndex(0);
    setSelectedChoice(null);
    setAnswerRecords([]);
    setIsFinished(false);
  }

  function startSubjectPractice(group: SubjectGroup) {
    const currentSeenMap = getSeenQuestionMap();
    const questions = pickQuestionsWithUnseenPriority(
      group.questions,
      Math.min(SUBJECT_QUESTION_COUNT, group.questions.length),
      currentSeenMap,
    );
    const nextSeenMap = saveSeenQuestions(questions, "subject", group.name);

    setSeenQuestionMap(nextSeenMap);

    resetSession({
      groupId: group.id,
      subjectName: group.name,
      sourceQuestionCount: group.questions.length,
      questions,
    });
  }

  function restartCurrentSession() {
    if (!selectedSession) {
      return;
    }

    const group = subjectGroups.find((subjectGroup) => subjectGroup.id === selectedSession.groupId);

    if (group) {
      startSubjectPractice(group);
    }
  }

  function resetSeenQuestionHistory() {
    clearSeenQuestions();
    setSeenQuestionMap({});
    setIsSeenQuestionMapLoaded(true);
  }

  function returnToSubjectSelection() {
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
      <article className="container practice-page weakness-page">
        <div className="practice-hero">
          <div>
            <p className="eyebrow">Weakness</p>
            <h1>科目別演習</h1>
            <p>
              収録済み{allPracticeQuestions.length}問を科目別に集計し、苦手科目を集中して10問ずつ解けます。
            </p>
          </div>
          <span className="status-badge">科目別・弱点対策</span>
        </div>

        <section className="section-block" aria-labelledby="weakness-subject-heading">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow">Select subject</p>
              <h2 id="weakness-subject-heading">苦手科目を集中して解く</h2>
            </div>
            <button className="button button-secondary" type="button" onClick={resetSeenQuestionHistory}>
              出題済み履歴をリセット
            </button>
          </div>

          <div className="practice-year-grid weakness-subject-grid">
            {subjectGroups.map((group) => {
              const groupSeenStats = getSeenStats(group.questions, seenQuestionMap);

              return (
                <section className="card practice-year-card weakness-subject-card" key={group.id}>
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
                      <dt>対象</dt>
                      <dd>{groupSeenStats.totalCount}問</dd>
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
                    onClick={() => startSubjectPractice(group)}
                  >
                    この科目を10問解く
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
      <article className="container practice-page weakness-page">
        <section className="card practice-result" aria-labelledby="weakness-result-heading">
          <p className="eyebrow">Result</p>
          <h1 id="weakness-result-heading">科目別演習結果</h1>
          <dl className="practice-result-list">
            <div>
              <dt>科目名</dt>
              <dd>{selectedSession.subjectName}</dd>
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
              同じ科目をもう一度解く
            </button>
            <button className="button button-secondary" type="button" onClick={returnToSubjectSelection}>
              科目選択に戻る
            </button>
          </div>
        </section>
      </article>
    );
  }

  if (!currentQuestion) {
    return (
      <article className="container practice-page weakness-page">
        <section className="card practice-result">
          <h1>問題を表示できませんでした</h1>
          <p>科目選択に戻って、もう一度選択してください。</p>
          <button className="button button-primary" type="button" onClick={returnToSubjectSelection}>
            科目選択に戻る
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
    <article className="container practice-page weakness-page">
      <div className="practice-question-header">
        <div>
          <p className="eyebrow">科目別演習</p>
          <h1>{selectedSession.subjectName}</h1>
          <p>
            進捗：{questionIndex + 1} / {selectedSession.questions.length}
          </p>
        </div>
        <button className="button button-secondary" type="button" onClick={returnToSubjectSelection}>
          科目選択に戻る
        </button>
      </div>

      <section className="card practice-question-card" aria-labelledby="weakness-question-heading">
        <div className="practice-meta-row">
          <span>{currentQuestion.era}</span>
          <span>{currentQuestion.year}年</span>
          <span>問{currentQuestion.qnum}</span>
          <span>{currentQuestion.subject}</span>
          <span>{currentQuestion.topic}</span>
          {currentQuestion.isExemptionQuestion ? <span>登録講習免除対象問</span> : null}
        </div>
        <h2 id="weakness-question-heading">問題文</h2>
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
