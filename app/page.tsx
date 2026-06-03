import Link from "next/link";

const primaryLinks = [
  { href: "/practice", label: "過去問演習を始める", description: "4択形式の演習ページを準備中です。" },
  { href: "/past", label: "過去問一覧を見る", description: "年度別の一覧ページを準備中です。" },
  { href: "/review", label: "復習する", description: "間違えた問題を見直す仕組みを準備中です。" },
  { href: "/traps", label: "ひっかけ対策を見る", description: "数字・期限・例外の整理ページを準備中です。" },
  { href: "/courses", label: "講座選びを整理する", description: "独学と講座利用の比較ページを準備中です。" },
];

const features = [
  "平成25年度〜令和7年度の宅建士過去問を今後収録予定",
  "演習、復習、弱点対策を1つの流れで使える構成を予定",
  "広告っぽさを抑え、学習のしやすさを重視した設計",
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">宅建士専用・準備中</p>
            <h1>宅建士の過去問演習を、やさしく続ける</h1>
            <p className="hero-text">
              平成25年度〜令和7年度の宅建士過去問をもとに、過去問演習・復習・弱点対策を進められる学習サイトを準備中です。
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/practice">
                過去問演習を始める
              </Link>
              <Link className="button button-secondary" href="/past">
                過去問一覧を見る
              </Link>
            </div>
          </div>
          <div className="hero-panel" aria-label="サイトで準備中の機能">
            <span className="status-badge">データ投入前</span>
            <h2>今後の学習フロー</h2>
            <ol>
              <li>年度別・分野別に問題を選ぶ</li>
              <li>4択問題に解答し、正誤を確認する</li>
              <li>解説を読んで、間違えた問題を復習する</li>
              <li>弱点とひっかけ表現を整理する</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Main menu</p>
            <h2>学習メニュー</h2>
            <p>各ページは現在準備中です。問題データ投入後に、順次機能を広げていく予定です。</p>
          </div>
          <div className="card-grid cards-3">
            {primaryLinks.map((link) => (
              <Link className="card link-card" href={link.href} key={link.href}>
                <h3>{link.label}</h3>
                <p>{link.description}</p>
                <span>ページへ進む</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section muted-section">
        <div className="container split-section">
          <div>
            <p className="eyebrow">Roadmap</p>
            <h2>宅建士学習サイトとして育てる予定です</h2>
            <p>
              まずは宅建士サイト単体の骨組みを整え、今後、過去問JSONや解説データを追加していきます。
              複数資格サイトを展開する際にも見通しよく使えるよう、シンプルな構成にしています。
            </p>
          </div>
          <ul className="check-list">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
