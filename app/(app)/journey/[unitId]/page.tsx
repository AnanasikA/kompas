import { UnitScreen } from "@/features/journey/JourneyScreen";

export default async function UnitPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;
  return <UnitScreen unitId={decodeURIComponent(unitId)} />;
}
