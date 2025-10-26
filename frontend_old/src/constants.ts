// src/constants.ts
import type { PersonaKey } from "./types";

export const PERSONAS: { key: PersonaKey; label: string }[] = [
  { key: "saas", label: "SaaS VC" },
  { key: "deeptech", label: "Deep Tech VC" },
  { key: "fintech", label: "Fintech VC" },
  { key: "custom", label: "Custom…" },
];
