import type { Metadata } from "next";
import { getTakkenPracticeYears } from "../../lib/takkenPractice";
import { TrapsClient } from "./TrapsClient";

export const metadata: Metadata = {
  title: "ひっかけ問題演習",
  description: "宅建士試験の過去問から、ひっかけ表現を含む問題を10問ずつ演習できるページです。",
};

export default function TrapsPage() {
  const practiceYears = getTakkenPracticeYears();

  return <TrapsClient practiceYears={practiceYears} />;
}
