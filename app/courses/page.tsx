import type { Metadata } from "next";
import { PreparationPage } from "../shared";

export const metadata: Metadata = {
  title: "宅建講座比較",
  description: "宅建士講座比較ページの準備状況です。外部リンクは未設置です。",
};

export default function CoursesPage() {
  return (
    <PreparationPage
      eyebrow="Courses"
      title="宅建講座比較"
      lead="独学と講座利用の違いを整理し、自分に合う学習方法を考えやすくするページを準備中です。"
      items={[
        "独学と講座利用の違いを整理する予定です。",
        "スマホ学習、講義・教材、過去問演習の観点で比較できる構成を検討しています。",
        "模試・直前対策、サポート体制も確認しやすくする予定です。",
        "外部リンク・ASPリンク・アフィリエイトリンクはまだ設置していません。",
      ]}
    />
  );
}
