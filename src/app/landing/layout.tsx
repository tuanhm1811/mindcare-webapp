import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TherapistAI — Trợ lý AI cho Chuyên gia Tâm lý Việt Nam",
  description:
    "Nền tảng AI giúp chuyên gia tâm lý tiết kiệm 80% thời gian ghi chú, theo dõi tiến trình thân chủ, và nâng cao chất lượng trị liệu. Dùng thử miễn phí 14 ngày.",
  keywords: [
    "therapist AI",
    "phần mềm tâm lý",
    "ghi chú trị liệu",
    "quản lý phòng khám tâm lý",
    "AI cho nhà trị liệu",
    "mental health SaaS",
    "Vietnam",
  ],
  openGraph: {
    title: "TherapistAI — Trợ lý AI cho Chuyên gia Tâm lý",
    description:
      "Tiết kiệm 80% thời gian hành chính. Tập trung vào điều quan trọng nhất — thân chủ của bạn.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
