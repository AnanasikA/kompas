import { Suspense } from "react";
import { JourneyScreen } from "@/features/journey/JourneyScreen";

export default function JourneyPage() {
  // The child map reads ?done=<lessonId> to play the walk to the next mission.
  return (
    <Suspense>
      <JourneyScreen />
    </Suspense>
  );
}
