export const DEFAULT_LOCALE = "en" as const;
export const SUPPORTED_LOCALES = ["en", "ar"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function isLocale(value: string | undefined | null): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function t(
  messages: Record<string, unknown>,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const parts = key.split(".");
  let curr: any = messages;
  for (const p of parts) {
    curr = curr?.[p];
  }

  if (typeof curr !== "string") return key;

  if (!vars) return curr;

  return curr.replace(/\{(\w+)\}/g, (_m, v) => {
    const value = vars[v];
    return value === undefined || value === null ? "" : String(value);
  });
}
