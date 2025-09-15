import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    // The API key is sourced from environment variables. This check makes
    // the app robust if the key is not provided in other environments.
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey: apiKey });
    } else {
      console.error('Gemini API key not found. The translation service will be disabled.');
    }
  }

  private ensureAiIsReady(): void {
    if (!this.ai) {
      throw new Error('Translation service is not available: API key is missing.');
    }
  }

  async translateText(
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<string> {
    this.ensureAiIsReady();
    if (!text.trim()) {
      return '';
    }

    const model = 'gemini-2.5-flash';
    const prompt = `You are an expert translator. Translate the following text from "${sourceLang}" to "${targetLang}". Provide only the translated text, without any additional explanations, introductions, or quotation marks.

Text to translate:
"${text}"`;

    try {
      const response: GenerateContentResponse = await this.ai!.models.generateContent({
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
      // Propagate the error so the component can handle it.
      if (error instanceof Error) {
          throw new Error(`Translation failed: ${error.message}`);
      }
      throw new Error('An unknown error occurred during translation.');
    }
  }

  async detectLanguage(text: string): Promise<string> {
    if (!this.ai) {
      // Fail silently if service is not configured
      return ''; 
    }

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