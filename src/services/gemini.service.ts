
import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // This is a placeholder for the API key which should be provided by the environment.
    // In a real Applet environment, process.env.API_KEY would be available.
    const apiKey = (process as any).env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY environment variable not set.");
      // In a real app, you might want to throw an error or handle this more gracefully.
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey });
  }

  async translateText(text: string, sourceLangName: string, targetLangName: string): Promise<string> {
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
      throw new Error('Failed to get translation from Gemini API.');
    }
  }
}
