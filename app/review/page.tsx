import type { Metadata } from "next";
import { ReviewClient } from "./ReviewClient";

export const metadata: Metadata = {
  title: "間違えた問題の復習",
  description: "保存した宅建過去問の間違い問題を復習するページです。",
};

export default function ReviewPage() {
  return <ReviewClient />;
}
