import type { Metadata } from "next";
import {
  getTakkenPastQuestionSummaries,
  getTakkenPastQuestionTotals,
} from "../../lib/takkenPastQuestions";

export const metadata: Metadata = {
  title: "宅建過去問一覧",
  description: "宅建士試験の年度別過去問データ収録状況です。",
};

const currentStatusText =
  "令和7年度から平成25年度までの15試験回分・750問を収録しています。収録済み過去問の確認と、年度別演習・ランダム演習へ進む前の一覧確認に利用できます。";

export default function PastPage() {
  const summaries = getTakkenPastQuestionSummaries();
  const totals = getTakkenPastQuestionTotals(summaries);

  return (
    <article className="container past-page">
      <div className="past-hero">
        <div>
          <p className="eyebrow">Past questions</p>
          <h1>宅建過去問一覧</h1>
          <p>
            現在は令和7年度〜平成25年度までの宅建過去問データを15試験回分収録済みです。収録試験ごとの状況と、
            登録講習免除対象問の有無を確認できます。
          </p>
        </div>
        <span className="status-badge">15試験回分・750問を収録済み</span>
      </div>

      <section className="section-block" aria-labelledby="past-status-heading">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Status</p>
          <h2 id="past-status-heading">収録状況</h2>
        </div>

        <div className="past-year-grid">
          {summaries.map((summary) => (
            <section className="card past-year-card" key={summary.examId}>
              <div className="past-year-card-header">
                <h3>{summary.era}</h3>
                <span>{summary.year}年</span>
              </div>
              <dl className="past-year-details">
                <div>
                  <dt>問題数</dt>
                  <dd>{summary.questionCount}問</dd>
                </div>
                <div>
                  <dt>登録講習免除対象問</dt>
                  <dd>{summary.hasExemptionQuestions ? "あり" : "なし"}</dd>
                </div>
              </dl>
            </section>
          ))}
        </div>
      </section>

      <section className="past-summary card" aria-labelledby="past-summary-heading">
        <div>
          <p className="eyebrow">Total</p>
          <h2 id="past-summary-heading">合計表示</h2>
        </div>
        <dl className="past-total-list">
          <div>
            <dt>収録試験</dt>
            <dd>{totals.examCount}回分</dd>
          </div>
          <div>
            <dt>収録問題数</dt>
            <dd>{totals.questionCount}問</dd>
          </div>
        </dl>
      </section>

      <section className="next-actions past-next-actions" aria-labelledby="past-plan-heading">
        <h2 id="past-plan-heading">収録状況について</h2>
        <p>{currentStatusText}</p>
      </section>
    </article>
  );
}
