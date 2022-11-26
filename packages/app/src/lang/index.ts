import { createSignal } from "solid-js";
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
document.documentElement.lang = initialLanguage;

const [selectedLanguage, setSelectedLanguage] = createSignal(initialLanguage);
const [selectedTFunction, setSelectedTFunction] = createSignal(initialTFunction);

export const language = selectedLanguage;
export const t: TFunction = (key) => selectedTFunction()(key);

export function setLanguage(code: string) {
  const [sel, tFunc] = selectLanguage(code);
  if (sel === code) {
    setSelectedLanguage(sel);
    setSelectedTFunction(() => tFunc);
    document.documentElement.lang = sel;
  }
}
