import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "広告・PRについて",
  description: "宅建士学習サイトの広告・PR表記方針についてのご案内です。",
};

const policyItems = [
  "当サイトでは、将来的に宅建講座・学習サービス等に関する広告リンク・アフィリエイトリンクを掲載する場合があります。",
  "広告リンクやPRリンクを掲載する場合は、広告・PRであることが分かるように表示します。",
  "掲載内容は、宅建学習や講座選びの参考情報であり、特定の講座の成果・合格・成績向上を保証するものではありません。",
  "講座内容・価格・キャンペーン・申込み条件などは変更される場合があります。",
  "申込み前には必ず各サービス・講座の公式情報を確認する必要があります。",
];

export default function AdvertisingPage() {
  return (
    <article className="container legal-page advertising-page">
      <p className="eyebrow">Advertising / PR</p>
      <h1>広告・PRについて</h1>
      <p>
        当サイトにおける広告リンク・PRリンクの掲載方針と、宅建講座・学習サービスに関する情報の位置づけをまとめています。
      </p>

      <section>
        <h2>広告リンク・PRリンクの掲載について</h2>
        <ul className="check-list compact">
          {policyItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>講座選びに関する情報の方針</h2>
        <p>
          当サイトは、学習者が比較前に見るポイントを整理できるようにすることを目的としています。
          ランキングや優劣の断定ではなく、学習スタイルに合わせて確認しやすい観点を整理する方針です。
        </p>
        <p>
          掲載する情報は判断材料の一つであり、講座や学習サービスの利用を強制するものではありません。
          申込みや利用の判断は、ご自身の学習状況や必要なサポートを確認したうえで行ってください。
        </p>
      </section>

      <section className="notice-box advertising-related-links" aria-labelledby="advertising-related-heading">
        <h2 id="advertising-related-heading">関連ページ</h2>
        <p>宅建講座を検討する前の整理や、サイト利用に関する方針もあわせて確認できます。</p>
        <div className="action-row">
          <Link className="button button-secondary" href="/courses">
            講座選びの整理を見る
          </Link>
          <Link className="button button-secondary" href="/privacy">
            プライバシーポリシー
          </Link>
          <Link className="button button-secondary" href="/terms">
            利用規約
          </Link>
          <Link className="button button-secondary" href="/contact">
            お問い合わせ
          </Link>
        </div>
      </section>
    </article>
  );
}
