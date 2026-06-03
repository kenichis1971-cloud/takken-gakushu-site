import type { Metadata } from "next";
import { PreparationPage } from "../shared";

export const metadata: Metadata = {
  title: "宅建過去問演習",
  description: "宅建士試験の過去問演習ページの準備状況です。",
};

export default function PracticePage() {
  return (
    <PreparationPage
      eyebrow="Practice"
      title="宅建過去問演習"
      lead="4択形式で解き、正誤判定と解説を確認できる演習ページを準備中です。"
      items={[
        "4択問題形式で演習できる画面を予定しています。",
        "解答後に正誤判定と解説を表示する予定です。",
        "ランダム出題や分野別演習に対応する構成を検討しています。",
        "将来的に宅建過去問JSONを読み込んで実装予定です。",
      ]}
    />
  );
}
