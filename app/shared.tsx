import Link from "next/link";

type PreparationPageProps = {
  eyebrow: string;
  title: string;
  lead: string;
  items: string[];
};

export function PreparationPage({ eyebrow, title, lead, items }: PreparationPageProps) {
  return (
    <article className="container prep-page">
      <div className="prep-hero">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{lead}</p>
        </div>
        <span className="status-badge">案内</span>
      </div>

      <section className="card prep-card">
        <h2>このページで確認できること</h2>
        <ul className="check-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="next-actions">
        <h2>ほかのページを見る</h2>
        <div className="action-row">
          <Link className="button button-primary" href="/practice">
            演習ページ
          </Link>
          <Link className="button button-secondary" href="/review">
            復習ページ
          </Link>
          <Link className="button button-secondary" href="/">
            トップへ戻る
          </Link>
        </div>
      </section>
    </article>
  );
}
