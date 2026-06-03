import type { Metadata } from "next";
import { PreparationPage } from "../shared";

export const metadata: Metadata = {
  title: "宅建過去問一覧",
  description: "宅建士試験の年度別過去問一覧ページの準備状況です。",
};

export default function PastPage() {
  return (
    <PreparationPage
      eyebrow="Past questions"
      title="宅建士過去問一覧"
      lead="平成25年度〜令和7年度の過去問データを、年度別に確認できる構成で収録予定です。"
      items={[
        "平成25年度〜令和7年度の過去問データを今後収録予定です。",
        "年度別に問題を確認できる一覧ページにする予定です。",
        "現時点では過去問データ投入前のため、問題本文や解答は掲載していません。",
      ]}
    />
  );
}
