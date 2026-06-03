import type { Metadata } from "next";
import { PreparationPage } from "../shared";

export const metadata: Metadata = {
  title: "弱点対策",
  description: "宅建士試験の分野別弱点対策ページの準備状況です。",
};

export default function WeaknessPage() {
  return (
    <PreparationPage
      eyebrow="Weakness"
      title="弱点対策"
      lead="分野別に弱点を整理し、次に復習する内容を見つけやすくするページを準備中です。"
      items={[
        "権利関係の弱点を整理できる構成を予定しています。",
        "宅建業法の頻出論点を見直しやすくする予定です。",
        "法令上の制限の苦手項目を確認できるようにする予定です。",
        "税・その他の分野も含めて、分野別に弱点を整理する予定です。",
      ]}
    />
  );
}
