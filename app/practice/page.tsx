import type { Metadata } from "next";
import { getTakkenPracticeYears } from "../../lib/takkenPractice";
import { PracticeClient } from "./PracticeClient";

export const metadata: Metadata = {
  title: "宅建過去問演習",
  description: "宅建士試験の年度別過去問と全年度ランダム50問を解ける演習ページです。",
};

export default function PracticePage() {
  const practiceYears = getTakkenPracticeYears();

  return <PracticeClient practiceYears={practiceYears} />;
}
