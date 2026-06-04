import type { Metadata } from "next";
import { getTakkenPracticeYears } from "../../lib/takkenPractice";
import { WeaknessClient } from "./WeaknessClient";

export const metadata: Metadata = {
  title: "科目別演習",
  description: "宅建士試験の過去問を科目別に10問ずつ演習できるページです。",
};

export default function WeaknessPage() {
  const practiceYears = getTakkenPracticeYears();

  return <WeaknessClient practiceYears={practiceYears} />;
}
