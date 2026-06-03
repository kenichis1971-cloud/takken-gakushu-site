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
          当サイトでは、できる限り分かりやすい情報提供を心がけますが、掲載情報の正確性・完全性・最新性を常に保証するものではありません。
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
          商品・サービスの申込みは、利用者自身の判断と責任で行ってください。当サイトの情報は、判断材料の一つとしてご利用ください。
        </p>
      </section>

      <section>
        <h2>内容変更について</h2>
        <p>当サイトの内容は、予告なく変更される場合があります。</p>
      </section>
    </article>
  );
}
