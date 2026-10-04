"use client";

import { useAge } from "./AgeScope";
import { SKINS, type Skin } from "./skins";

export function useSkin(): Skin {
  return SKINS[useAge()];
}
