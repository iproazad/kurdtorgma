import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface GeminiResponse {
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private http = inject(HttpClient);
  private proxyUrl = '/api/gemini-proxy'; 

  private async callGeminiProxy(prompt: string, temperature: number, thinkingBudget?: number): Promise<string> {
    try {
      const body = {
        prompt,
        action: 'generate', // To differentiate requests if needed in the future
        temperature,
        ...(thinkingBudget !== undefined && { thinkingBudget })
      };
      const response = await firstValueFrom(this.http.post<GeminiResponse>(this.proxyUrl, body));
      return response.text;
    } catch (error) {
      console.error('Error calling Gemini proxy function:', error);
      throw new Error('Failed to get response from the server.');
    }
  }

  async translateText(text: string, sourceLangName: string, targetLangName: string): Promise<string> {
    const prompt = `You are a professional translator. Translate the following text from "${sourceLangName}" to "${targetLangName}". Provide only the translated text, without any additional explanations, introductions, or quotation marks.
    
Text to translate:
"${text}"
`;
    // For translation, we want a direct, fast response.
    return this.callGeminiProxy(prompt, 0.3, 0);
  }

  async spellCheckText(text: string, sourceLangName: string): Promise<string> {
    const prompt = `You are a meticulous spell and grammar checker. Correct any spelling mistakes and grammatical errors in the following text, which is in "${sourceLangName}". Respond ONLY with the corrected text. Do not add any introductions, explanations, or quotation marks. If the text is already perfect, return it as is.

Text to correct:
"${text}"
`;
    // For spell checking, we want a deterministic, fast response.
    return this.callGeminiProxy(prompt, 0, 0);
  }
}
