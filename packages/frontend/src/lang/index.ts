import { readable, writable } from "svelte/store";
import deStrings from "./de.json";

type LanguageKeys = keyof typeof deStrings;

export interface TFunction {
  (key: LanguageKeys): string;
}

const LANGUAGE_MAP: Record<string, TFunction | undefined> = {
  de(key) {
    return (deStrings as Record<string, string>)[key] ?? key;
  },
};

function selectLanguage(code: string): readonly [string, TFunction] {
  const tFunc = LANGUAGE_MAP[code];
  if (tFunc) {
    return [code, tFunc];
  }
  return ["de", LANGUAGE_MAP.de!];
}

const [initialLanguage, initialTFunction] = selectLanguage(navigator.language);
export const lang = writable(initialLanguage);

lang.subscribe((nextLanguage) => {
  document.documentElement.lang = nextLanguage;
});

export const t = readable(initialTFunction, (set) =>
  lang.subscribe((nextLanguage) => set(selectLanguage(nextLanguage)[1]))
);
