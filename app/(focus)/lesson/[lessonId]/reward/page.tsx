import { LessonReward } from "@/features/lessons/LessonReward";

export default async function LessonRewardPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  return <LessonReward lessonId={decodeURIComponent(lessonId)} />;
}
