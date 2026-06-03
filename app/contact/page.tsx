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
        現在、お問い合わせフォームの設置を準備中です。サイト内容に関するご連絡方法は、今後このページで案内します。
      </p>
      <section className="notice-box">
        <h2>準備中の内容</h2>
        <ul className="check-list compact">
          <li>過去問データや解説内容に関する連絡窓口</li>
          <li>講座比較ページに関する修正依頼の受付方法</li>
          <li>サイト運営者への問い合わせ方法</li>
        </ul>
      </section>
    </article>
  );
}
