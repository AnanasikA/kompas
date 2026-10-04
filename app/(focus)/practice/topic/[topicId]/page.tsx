import { TopicRoundScreen } from "@/features/practice/TopicRoundScreen";

export default async function TopicRoundPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  return <TopicRoundScreen topicId={decodeURIComponent(topicId)} />;
}
