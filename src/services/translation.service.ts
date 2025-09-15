import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private ai: GoogleGenAI | null = null;
  private readonly apiKeyError = 'A valid Gemini API key is not configured. Please set the API_KEY to use this feature.';

  constructor() {
    const apiKey = process.env.API_KEY;
    if (apiKey && apiKey !== 'DEFAULT_API_KEY') {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      // The app will load, but translation calls will fail with the error below.
      console.warn(this.apiKeyError);
    }
  }

  async translateText(
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<string> {
    if (!this.ai) {
      throw new Error(this.apiKeyError);
    }

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
          if (error.message.includes('API key not valid')) {
              throw new Error('The provided Gemini API key is invalid.');
          }
          throw new Error(`Translation failed: ${error.message}`);
      }
      throw new Error('An unknown error occurred during translation.');
    }
  }

  async detectLanguage(text: string): Promise<string> {
    // If the API key is missing, fail gracefully for this background feature.
    if (!this.ai) {
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