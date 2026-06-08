import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "宅建士学習サイトへのお問い合わせ案内です。",
};

export default function ContactPage() {
  return (
    <article className="container legal-page">
      <p className="eyebrow">Contact</p>
      <h1>お問い合わせ</h1>
      <p>
        当サイトの掲載内容について確認が必要な点がある場合は、内容を具体的に整理したうえでお問い合わせください。
        過去問データ、解説、サイト表示に関するご連絡を確認対象としています。
      </p>
      <section className="notice-box">
        <h2>お問い合わせ前にご確認ください</h2>
        <ul className="check-list compact">
          <li>お問い合わせ内容により、回答までに時間がかかる場合があります。</li>
          <li>個別の学習計画、合否判定、法律相談、講座の申込み代行には対応していません。</li>
          <li>試験制度や申込み手続きの最新情報は、公式情報もあわせてご確認ください。</li>
        </ul>
      </section>
    </article>
  );
}
