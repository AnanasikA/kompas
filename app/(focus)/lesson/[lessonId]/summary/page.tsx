import { LessonSummary } from "@/features/lessons/LessonSummary";

export default async function LessonSummaryPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  return <LessonSummary lessonId={decodeURIComponent(lessonId)} />;
}
