import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private ai: GoogleGenAI | null = null;
  private readonly notInitializedError = 'API Key is not set. Please configure your key in the settings.';

  constructor() {
    // Initialization is now handled dynamically via the initialize method.
  }

  /**
   * Initializes the GoogleGenAI instance with the provided API key.
   * @param apiKey The Gemini API key.
   */
  initialize(apiKey: string): void {
    if (!apiKey) {
      this.ai = null;
      console.error("Attempted to initialize TranslationService with an empty API key.");
      return;
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async translateText(
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<string> {
    if (!this.ai) {
      throw new Error(this.notInitializedError);
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

  /**
   * Verifies if the initialized API key is valid by making a lightweight request.
   * @returns {Promise<boolean>} True if the key is valid, false otherwise.
   */
  async verifyApiKey(): Promise<boolean> {
    if (!this.ai) {
      // If service isn't initialized, key is effectively invalid for use.
      return false;
    }

    try {
      // Use a simple, non-streaming, low-token-consuming request to verify connectivity and authentication.
      await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'hi', // A simple prompt
        config: {
          maxOutputTokens: 1, // We don't care about the response, just that it succeeds.
          thinkingConfig: { thinkingBudget: 0 } // No need for thinking
        }
      });
      return true; // If the request does not throw, the key is valid.
    } catch (error) {
      console.error('API Key verification failed:', error);
      // Any error during this check (auth, network, etc.) is treated as a verification failure.
      return false;
    }
  }
}