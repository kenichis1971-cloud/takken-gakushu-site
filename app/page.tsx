import Link from "next/link";

const primaryCtas = [
  { href: "/practice", label: "過去問演習を始める", variant: "button-primary" },
  { href: "/weakness", label: "科目別に弱点対策する", variant: "button-secondary" },
  { href: "/traps", label: "ひっかけ問題を解く", variant: "button-secondary" },
];

const learningMenus = [
  {
    title: "年度別演習",
    description: "令和7年度〜平成29年度まで、試験回ごとに順番で確認できます。",
    href: "/practice",
    linkLabel: "年度別で解く",
  },
  {
    title: "全年度ランダム50問",
    description: "収録済み550問から、未出題を優先して50問を出題します。",
    href: "/practice",
    linkLabel: "ランダム演習へ",
  },
  {
    title: "科目別演習",
    description: "権利関係・宅建業法・法令上の制限など、科目ごとに10問ずつ確認できます。",
    href: "/weakness",
    linkLabel: "科目別に解く",
  },
  {
    title: "ひっかけ問題演習",
    description: "正誤、できる・できない、期限・数字など、迷いやすい表現を含む問題を確認できます。",
    href: "/traps",
    linkLabel: "ひっかけ対策へ",
  },
  {
    title: "間違えた問題の復習",
    description: "演習で間違えた問題だけを保存し、あとから解き直せます。",
    href: "/review",
    linkLabel: "復習ページへ",
  },
  {
    title: "収録済み過去問一覧",
    description: "現在収録している11試験回分・550問の状況を確認できます。",
    href: "/past",
    linkLabel: "収録状況を見る",
  },
];

const usageSteps = [
  "まずは全年度ランダム50問で、今の理解度を確認する",
  "間違えた問題を復習ページで見直し、もう一度解き直す",
  "苦手科目やひっかけ問題を、科目別演習・ひっかけ問題演習で補強する",
];

const collectionStats = [
  { label: "収録試験", value: "11回分" },
  { label: "収録問題数", value: "550問" },
  { label: "対象", value: "令和7年度〜平成29年度" },
];

export default function Home() {
  return (
    <>
      <section className="hero top-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">宅建士の過去問演習サイト</p>
            <h1>宅建過去問演習サイト</h1>
            <p className="hero-text">
              令和7年度〜平成29年度までの過去問を、年度別・ランダム・科目別・ひっかけ対策・復習で確認できます。
            </p>
            <div className="hero-actions" aria-label="主要な学習メニュー">
              {primaryCtas.map((cta) => (
                <Link className={`button ${cta.variant}`} href={cta.href} key={cta.href}>
                  {cta.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hero-panel hero-image-ready" aria-label="収録状況">
            <span className="status-badge">収録状況</span>
            <h2>11試験回分・550問を収録</h2>
            <p>
              現在は、令和7年度〜平成29年度までの11試験回分・550問を収録しています。
            </p>
            <dl className="stats-list">
              {collectionStats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Learning menu</p>
            <h2>今できる学習メニュー</h2>
            <p>
              ランダム演習から復習、科目別・ひっかけ対策まで、目的に合わせて内部メニューを選べます。
            </p>
          </div>
          <div className="card-grid cards-3">
            {learningMenus.map((menu) => (
              <article className="card menu-card" key={`${menu.title}-${menu.href}`}>
                <div>
                  <h3>{menu.title}</h3>
                  <p>{menu.description}</p>
                </div>
                <Link className="button button-secondary card-button" href={menu.href}>
                  {menu.linkLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section muted-section">
        <div className="container split-section">
          <div>
            <p className="eyebrow">How to use</p>
            <h2>おすすめの使い方</h2>
            <p>
              迷ったときの使い方の一例です。学習状況に合わせて、必要なメニューから始められます。
            </p>
          </div>
          <ol className="step-list">
            {usageSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container course-note card">
          <div>
            <p className="eyebrow">Course guide</p>
            <h2>宅建講座選びの整理ページ</h2>
            <p>
              学習サービスや講座を比較する前に、見るポイントを整理するページです。現時点では外部リンクや広告リンクは設置していません。
            </p>
          </div>
          <Link className="button button-secondary" href="/courses">
            講座選びの整理を見る
          </Link>
        </div>
      </section>

      <section className="section home-disclosure-section">
        <div className="container disclosure-card">
          <div>
            <p className="eyebrow">Advertising / PR</p>
            <h2>広告・PR方針について</h2>
            <p>
              当サイトでは、将来的に宅建講座や学習サービスに関する広告・PRリンクを掲載する場合があります。掲載する場合は、広告・PRであることが分かる形で表示します。
            </p>
          </div>
          <Link className="text-link" href="/advertising">
            広告・PRについて
          </Link>
        </div>
      </section>
    </>
  );
}
