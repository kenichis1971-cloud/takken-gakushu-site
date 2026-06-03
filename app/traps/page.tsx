import type { Metadata } from "next";
import { PreparationPage } from "../shared";

export const metadata: Metadata = {
  title: "ひっかけ対策",
  description: "宅建士試験のひっかけ対策ページの準備状況です。",
};

export default function TrapsPage() {
  return (
    <PreparationPage
      eyebrow="Traps"
      title="ひっかけ対策"
      lead="宅建試験で間違えやすい表現や、混同しやすい論点を整理するページを準備中です。"
      items={[
        "宅建試験で間違えやすい表現を整理する予定です。",
        "数字・期限・例外・権利関係の混同を見直せる構成を予定しています。",
        "ひっかけ問題のパターンを、学習しやすい形でまとめる予定です。",
      ]}
    />
  );
}
