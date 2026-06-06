import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "宅建講座を選ぶ前に整理したいこと",
  description:
    "宅建講座や学習サービスを比較する前に、学習状況・苦手分野・必要なサポートを整理するためのページです。",
};

const preCourseChecklist = [
  "独学で続けられるか",
  "過去問演習で苦手分野が見えているか",
  "宅建業法・権利関係・法令上の制限のどこでつまずきやすいか",
  "講義で理解したいのか、問題演習を増やしたいのか",
  "スマホ学習を重視するか",
  "質問サポートが必要か",
  "模試・直前対策が必要か",
  "費用と学習時間のバランスをどう考えるか",
];

const learningTypes = [
  {
    title: "初学者の場合",
    description: "宅建の範囲をこれから学び始める場合は、基礎を順番に確認できるかを見ておくと比較しやすくなります。",
    points: [
      "基礎から順番に学べるか",
      "法律用語の説明が分かりやすいか",
      "宅建業法・権利関係の土台を作りやすいか",
      "学習スケジュールを立てやすいか",
    ],
  },
  {
    title: "独学で進めている場合",
    description: "市販教材や過去問で進めている場合は、自力で補える部分と、外部サポートがあると助かる部分を分けて考えます。",
    points: [
      "過去問演習で弱点が把握できているか",
      "分からない論点を自分で調べられるか",
      "復習の仕組みを作れているか",
      "必要な部分だけ講座や教材で補う選択肢があるか",
    ],
  },
  {
    title: "忙しい社会人の場合",
    description: "まとまった学習時間を取りにくい場合は、短い時間でも進めやすい設計かを確認しておくと判断材料になります。",
    points: [
      "スマホで学習しやすいか",
      "1回あたりの講義や演習が短時間で進めやすいか",
      "通勤時間や休憩時間に復習しやすいか",
      "進捗管理をしやすいか",
    ],
  },
  {
    title: "直前期・再受験の場合",
    description: "直前期や再受験では、全範囲を広く見直すのか、苦手分野やミスしやすい表現を優先するのかを整理します。",
    points: [
      "苦手分野を短時間で確認できるか",
      "模試や予想問題を使うか",
      "過去問の解き直しを優先するか",
      "ひっかけ問題や数字・期限の整理をできるか",
    ],
  },
];

const commonQuestions = [
  "独学を続けるか、講座を使うか",
  "講義中心か、問題演習中心か",
  "スマホ学習をどこまで重視するか",
  "質問サポートが必要か",
  "模試・直前対策を利用するか",
  "費用を重視するか、サポートを重視するか",
];

const internalLinks = [
  {
    href: "/practice",
    title: "過去問演習",
    text: "年度別演習や全年度ランダム50問で、現在の理解度を確認します。",
  },
  {
    href: "/weakness",
    title: "弱点対策",
    text: "科目別10問演習で、苦手分野を整理するきっかけにします。",
  },
  {
    href: "/traps",
    title: "ひっかけ対策",
    text: "ミスしやすい表現や数字・期限の確認に使います。",
  },
  {
    href: "/review",
    title: "復習",
    text: "間違えた問題を解き直し、復習が必要な論点を確認します。",
  },
  {
    href: "/past",
    title: "過去問一覧",
    text: "収録済みの過去問と問題数を確認します。",
  },
];

export default function CoursesPage() {
  return (
    <article className="container courses-page">
      <section className="courses-hero" aria-labelledby="courses-heading">
        <div className="courses-hero-copy">
          <p className="eyebrow">Courses</p>
          <h1 id="courses-heading">宅建講座を選ぶ前に整理したいこと</h1>
          <p>
            宅建の学習方法は、独学・市販教材・通信講座・オンライン学習など複数あります。いきなり講座を比較する前に、
            今の学習状況、苦手分野、使える時間、必要なサポートを整理しておくと、自分に合う学習手段を考えやすくなります。
          </p>
        </div>
        <div className="card courses-hero-card hero-image-ready" aria-label="このページの位置づけ">
          <span className="status-badge">比較前の整理ページ</span>
          <p>
            このページは、特定講座のランキングや優劣ではなく、講座・学習サービスを選ぶ前に見る観点を整理するためのページです。
          </p>
        </div>
      </section>

      <section className="section-block" aria-labelledby="course-checklist-heading">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Checklist</p>
          <h2 id="course-checklist-heading">講座を検討する前のチェックリスト</h2>
          <p>
            講座を使うか、独学で進めるかを考える前に、自分の学習状況を一度書き出してみると、必要なサポートを考えやすくなります。
          </p>
        </div>
        <section className="card courses-check-card">
          <ul className="check-list courses-check-list">
            {preCourseChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </section>

      <section className="section-block" aria-labelledby="learning-type-heading">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Learning type</p>
          <h2 id="learning-type-heading">学習タイプ別の整理</h2>
          <p>
            同じ宅建学習でも、初学者・独学中・忙しい社会人・直前期や再受験では、見ておきたいポイントが変わります。
          </p>
        </div>
        <div className="card-grid courses-type-grid">
          {learningTypes.map((type) => (
            <section className="card courses-type-card" key={type.title}>
              <h3>{type.title}</h3>
              <p>{type.description}</p>
              <ul className="check-list compact">
                {type.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="section-block" aria-labelledby="course-questions-heading">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Common questions</p>
          <h2 id="course-questions-heading">比較前によくある迷い</h2>
          <p>
            講座名や価格を見る前に、どの迷いが大きいのかを整理しておくと、比較する項目を絞り込みやすくなります。
          </p>
        </div>
        <div className="courses-question-grid">
          {commonQuestions.map((question) => (
            <div className="card courses-question-card" key={question}>
              {question}
            </div>
          ))}
        </div>
      </section>

      <section className="section-block" aria-labelledby="site-check-heading">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Inside this site</p>
          <h2 id="site-check-heading">このサイト内で先に確認できること</h2>
          <p>
            講座を比較する前に、まずは過去問演習で自分の苦手分野を整理しておくと、必要なサポートを考えやすくなります。
          </p>
        </div>
        <div className="card-grid courses-link-grid">
          {internalLinks.map((item) => (
            <Link className="card link-card courses-link-card" href={item.href} key={item.href}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <span>ページを見る</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="notice-box courses-notice" aria-labelledby="course-notice-heading">
        <h2 id="course-notice-heading">確認しておきたいこと</h2>
        <p>
          このページは、宅建講座や学習サービスを比較する前に確認したい観点を整理するためのものです。特定の講座の成果や合格を保証するものではありません。
          講座内容・価格・キャンペーン・申込み条件などは変更される場合があるため、申込み前には必ず各公式情報をご確認ください。
        </p>
        <p>
          今後、資格講座や学習サービスに関する広告・PRリンクを掲載する場合があります。掲載する場合は、広告・PRであることが分かるように表示します。
          詳しくは<Link className="inline-link" href="/advertising">広告・PRについて</Link>をご確認ください。
        </p>
      </section>
    </article>
  );
}
