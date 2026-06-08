import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
  description: "宅建士学習サイトの利用規約です。",
};

export default function TermsPage() {
  return (
    <article className="container legal-page">
      <p className="eyebrow">Terms</p>
      <h1>利用規約</h1>
      <p>当サイトを利用する際は、以下の内容をご確認ください。</p>

      <section>
        <h2>掲載情報について</h2>
        <p>
          当サイトは宅建士試験の学習補助を目的としたサイトです。過去問データや解説は正確性に配慮して掲載していますが、正確性・完全性・最新性を常に保証するものではありません。
        </p>
        <p>
          法改正や試験制度の変更などにより、掲載内容が現在の出題範囲や公式情報と異なる場合があります。学習や申込みに関する最終判断の際は、公式情報等もあわせてご確認ください。
        </p>
      </section>

      <section>
        <h2>外部サービスについて</h2>
        <p>
          将来的に外部サイトや外部サービスを紹介する場合がありますが、その情報やサービス内容について当サイトが常に保証するものではありません。
        </p>
      </section>

      <section>
        <h2>申込み・利用判断について</h2>
        <p>
          当サイトの情報は、判断材料の一つとしてご利用ください。学習成果、得点向上、合格を保証するものではありません。
          商品・サービスの申込みは、利用者自身の判断で行ってください。
        </p>
      </section>

      <section>
        <h2>内容変更について</h2>
        <p>当サイトの内容は、予告なく変更される場合があります。</p>
      </section>
    </article>
  );
}
