import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

// Assume process.env.API_KEY is available in the execution environment.
declare const process: {
  env: {
    API_KEY: string;
  };
};

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private async generateContent(prompt: string, temperature: number, thinkingBudget?: number): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature,
          ...(thinkingBudget !== undefined && { thinkingConfig: { thinkingBudget } })
        }
      });
      return response.text.trim();
    } catch (error) {
       console.error('Error calling Gemini API:', error);
       if (error.toString().includes('API key not valid')) {
         throw new Error('مفتاح API غير صالح. يرجى التحقق منه.');
       }
       throw new Error('فشل الاتصال بخدمة Gemini.');
    }
  }

  async translateText(text: string, sourceLangName: string, targetLangName:string): Promise<string> {
    const prompt = `You are a professional translator. Translate the following text from "${sourceLangName}" to "${targetLangName}". Provide only the translated text, without any additional explanations, introductions, or quotation marks.
    
Text to translate:
"${text}"
`;
    // For translation, we want a direct, fast response with thinking disabled.
    return this.generateContent(prompt, 0.3, 0);
  }

  async spellCheckText(text: string, sourceLangName: string): Promise<string> {
    const prompt = `You are a meticulous spell and grammar checker. Correct any spelling mistakes and grammatical errors in the following text, which is in "${sourceLangName}". Respond ONLY with the corrected text. Do not add any introductions, explanations, or quotation marks. If the text is already perfect, return it as is.

Text to correct:
"${text}"
`;
    // For spell checking, we want a deterministic, fast response with thinking disabled.
    return this.generateContent(prompt, 0, 0);
  }
}
