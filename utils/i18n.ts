import { cookies } from "next/headers";

import {
  DEFAULT_LOCALE,
  isLocale,
  Locale,
  SUPPORTED_LOCALES,
} from "@/utils/i18n-core";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get("locale")?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function loadNamespace(locale: Locale, namespace: string) {
  const mod = await import(`../locales/${locale}/${namespace}.json`);
  return mod.default as Record<string, unknown>;
}

export async function loadMessages(
  locale: Locale,
  namespaces: string[],
): Promise<Record<string, unknown>> {
  const entries = await Promise.all(
    namespaces.map(async (ns) => [ns, await loadNamespace(locale, ns)] as const),
  );

  return Object.fromEntries(entries);
}

export { DEFAULT_LOCALE, SUPPORTED_LOCALES };
