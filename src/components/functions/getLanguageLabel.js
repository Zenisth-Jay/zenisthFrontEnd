import { LANGUAGES } from "../../data/translateLanguage";

export const LANGUAGE_MAP = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l.label]),
);
