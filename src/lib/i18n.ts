export const locales = ["en", "es"] as const;
export type Locale = typeof locales[number];

export async function getDictionary(locales: Locale) {
  const dict = await import(`../app/dictionaries/${locales}.json`);
  return dict.default;
}
