import { LessonPlayer } from "@/features/lessons/LessonPlayer";

export default async function LessonPlayPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  return <LessonPlayer lessonId={decodeURIComponent(lessonId)} />;
}
