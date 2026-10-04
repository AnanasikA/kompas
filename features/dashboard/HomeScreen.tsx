"use client";

import { ByAge } from "@/features/theme/shells/AppShell";
import { AdultHome } from "./AdultHome";
import { ChildHome } from "./ChildHome";
import { TeenHome } from "./TeenHome";

export function HomeScreen() {
  return <ByAge child={<ChildHome />} teen={<TeenHome />} adult={<AdultHome />} />;
}
