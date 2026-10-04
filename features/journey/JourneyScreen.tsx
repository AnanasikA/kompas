"use client";

import { ByAge } from "@/features/theme/shells/AppShell";
import { AdultJourney } from "./AdultJourney";
import { ChildJourney } from "./ChildJourney";
import { ChildUnit } from "./ChildUnit";
import { TeenJourney } from "./TeenJourney";

export function JourneyScreen() {
  return <ByAge child={<ChildJourney />} teen={<TeenJourney />} adult={<AdultJourney />} />;
}

/** Only the child mode has a separate world page; arcs and modules open inline. */
export function UnitScreen({ unitId }: { unitId: string }) {
  return <ByAge child={<ChildUnit unitId={unitId} />} teen={<TeenJourney />} adult={<AdultJourney />} />;
}
