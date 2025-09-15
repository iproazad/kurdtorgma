export interface Language {
  code: string;
  name: string;
}

export interface HistoryItem {
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  sourceLangName: string;
  targetLangName: string;
  timestamp: number;
}
