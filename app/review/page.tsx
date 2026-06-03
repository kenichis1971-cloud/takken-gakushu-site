import type { Metadata } from "next";
import { PreparationPage } from "../shared";

export const metadata: Metadata = {
  title: "復習",
  description: "宅建士試験の復習ページの準備状況です。",
};

export default function ReviewPage() {
  return (
    <PreparationPage
      eyebrow="Review"
      title="復習ページ"
      lead="間違えた問題や苦手分野を見直しやすくするための復習ページを準備中です。"
      items={[
        "間違えた問題を後から復習できる仕組みを予定しています。",
        "苦手分野を確認し、優先して見直せる構成にする予定です。",
        "学習履歴をもとに復習しやすくする機能を検討しています。",
      ]}
    />
  );
}
