// src/lib/utils.ts

export function formatMasterData(str: string): string {
  if (!str) return "";
  return str
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}