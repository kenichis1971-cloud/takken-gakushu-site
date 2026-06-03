import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "宅建士学習サイトのプライバシーポリシーです。",
};

export default function PrivacyPage() {
  return (
    <article className="container legal-page">
      <p className="eyebrow">Privacy policy</p>
      <h1>プライバシーポリシー</h1>
      <p>
        当サイトでは、宅建士試験の学習に役立つ情報を提供するため、必要な範囲で利用者の情報を取り扱う場合があります。
      </p>

      <section>
        <h2>取得する情報と利用目的</h2>
        <p>
          お問い合わせ等でお名前、連絡先、相談内容などを取得した場合、回答や連絡、サイト運営上必要な確認のために利用します。
        </p>
      </section>

      <section>
        <h2>Cookie等について</h2>
        <p>
          当サイトでは、利便性の向上や利用状況の把握のため、Cookie等を使用する場合があります。利用者はブラウザの設定によりCookieの受け入れを変更できます。
        </p>
      </section>

      <section>
        <h2>広告・アフィリエイトについて</h2>
        <p>
          将来的に、当サイトではアフィリエイト広告を掲載する場合があります。広告リンク経由で商品・サービスの申込みがあった場合、当サイトが報酬を受け取る場合があります。
        </p>
        <p>
          これは商品・サービスの申込みを強制するものではありません。申込みは、利用者自身の判断で行ってください。
        </p>
      </section>

      <section>
        <h2>公式情報の確認について</h2>
        <p>
          講座内容、価格、時期限定の案内、サポート条件、実績等は変更される場合があります。申込み前には、必ず各サービスの公式情報を確認してください。
        </p>
      </section>
    </article>
  );
}
