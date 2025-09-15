import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;

  initialize(apiKey: string): void {
    if (!apiKey || !apiKey.trim()) {
      throw new Error('API Key is required.');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async translateText(text: string, sourceLangName: string, targetLangName: string): Promise<string> {
    if (!this.ai) {
      throw new Error('Gemini Service not initialized. Please provide an API Key first.');
    }

    const model = 'gemini-2.5-flash';
    const prompt = `You are a professional translator. Translate the following text from "${sourceLangName}" to "${targetLangName}". Provide only the translated text, without any additional explanations, introductions, or quotation marks.
    
Text to translate:
"${text}"
`;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          temperature: 0.3,
          // Disable thinking for faster, direct translation
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      
      return response.text.trim();
    } catch (error) {
      console.error('Error translating text:', error);
      if (error instanceof Error && error.message.includes('API key not valid')) {
          throw new Error('مفتاح API المقدم غير صالح. يرجى التحقق منه والمحاولة مرة أخرى.');
      }
      throw new Error('Failed to get translation from Gemini API.');
    }
  }
}
