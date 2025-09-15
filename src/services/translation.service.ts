import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private ai: GoogleGenAI;

  constructor() {
    // The API key is sourced from environment variables, which is handled
    // by the Applet environment.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async translateText(
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<string> {
    if (!text.trim()) {
      return '';
    }

    const model = 'gemini-2.5-flash';
    const prompt = `You are an expert translator. Translate the following text from "${sourceLang}" to "${targetLang}". Provide only the translated text, without any additional explanations, introductions, or quotation marks.

Text to translate:
"${text}"`;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          temperature: 0.3,
          // Disable thinking for faster translation response
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text.trim();
    } catch (error) {
      console.error('Error translating text:', error);
      if (error instanceof Error) {
        return `Error: Could not translate. ${error.message}`;
      }
      return 'An unknown error occurred during translation.';
    }
  }

  async detectLanguage(text: string): Promise<string> {
    if (text.trim().length < 10) {
      return '';
    }

    const model = 'gemini-2.5-flash';
    const prompt = `Detect the language of the following text. Respond with only the common name of the language (e.g., 'English', 'Arabic (Iraqi Dialect)', 'Kurdish (Sorani)', 'Spanish'). Do not add any other words, explanations, or punctuation.

Text:
"${text}"`;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          temperature: 0.1,
          thinkingConfig: { thinkingBudget: 0 },
        },
      });
      return response.text.trim();
    } catch (error) {
      console.error('Error detecting language:', error);
      // Fail gracefully without alerting the user
      return '';
    }
  }
}