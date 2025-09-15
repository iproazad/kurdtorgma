
import { GoogleGenAI } from "@google/genai";

/**
 * Translates text using the Gemini API.
 * @param text The text to translate.
 * @param sourceLang The source language code (or 'auto' for detection).
 * @param targetLang The target language code.
 * @param apiKey The Gemini API key.
 * @returns A promise that resolves to the translated text string.
 */
export const translateText = async (text: string, sourceLang: string, targetLang: string, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error('API Key is required.');
  }
  const ai = new GoogleGenAI({ apiKey });

  const model = 'gemini-2.5-flash';
  
  const fromLanguage = sourceLang === 'auto' ? 'auto-detect' : sourceLang;

  const prompt = `Translate the following text from ${fromLanguage} to ${targetLang}: "${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text.trim();

  } catch (error) {
    console.error('Detailed error from Gemini API:', error);
    
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error('The API key is not valid. Please check it and save it again.');
        }
        if (error.message.toLowerCase().includes('billing')) {
            throw new Error('Billing is not enabled for the project. Please check your Google Cloud account and enable billing.');
        }
        if (error.message.toLowerCase().includes('permission denied')) {
            throw new Error('API permission denied. Ensure the "Generative Language API" is enabled in your Google Cloud project.');
        }
         if (error.message.toLowerCase().includes('quota')) {
            throw new Error('You have exceeded your API quota. Please check your usage limits in Google Cloud.');
        }
    }
    
    throw new Error('Failed to translate text. Check the developer console (F12) for more details.');
  }
};
