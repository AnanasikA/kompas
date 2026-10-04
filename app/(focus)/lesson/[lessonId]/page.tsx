import { LessonStart } from "@/features/lessons/LessonStart";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  return <LessonStart lessonId={decodeURIComponent(lessonId)} />;
}
