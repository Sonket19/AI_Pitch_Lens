// src/helpers.ts
export const cls = (...parts: Array<string | false | undefined | null>) =>
  parts.filter(Boolean).join(" ");
