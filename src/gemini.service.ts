import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;

export function initialize(apiKey: string): boolean {
  if (!apiKey) {
    console.error("API Key is required for initialization.");
    return false;
  }
  try {
    ai = new GoogleGenAI({ apiKey });
    return true;
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI:", e);
    ai = null;
    return false;
  }
}

async function generateContent(prompt: string, temperature: number, thinkingBudget?: number): Promise<string> {
  if (!ai) {
    throw new Error('Gemini Service has not been initialized. Please provide an API Key.');
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature,
        ...(thinkingBudget !== undefined && { thinkingConfig: { thinkingBudget } })
      }
    });
    return response.text.trim();
  } catch (error: any) {
     console.error('Error calling Gemini API:', error);
     if (error.toString().includes('API key not valid')) {
       throw new Error('مفتاح API غير صالح. يرجى التحقق منه.');
     }
     throw new Error('فشل الاتصال بخدمة Gemini.');
  }
}

export async function verifyApiKey(): Promise<void> {
  await generateContent('hi', 0, 0);
}

export async function translateText(text: string, sourceLangName: string, targetLangName: string): Promise<string> {
  const prompt = `You are a professional translator. Translate the following text from "${sourceLangName}" to "${targetLangName}". Provide only the translated text, without any additional explanations, introductions, or quotation marks.
    
Text to translate:
"${text}"
`;
  return generateContent(prompt, 0.3, 0);
}

export async function spellCheckText(text: string, sourceLangName: string): Promise<string> {
  const prompt = `You are a meticulous spell and grammar checker. Correct any spelling mistakes and grammatical errors in the following text, which is in "${sourceLangName}". Respond ONLY with the corrected text. Do not add any introductions, explanations, or quotation marks. If the text is already perfect, return it as is.

Text to correct:
"${text}"
`;
  return generateContent(prompt, 0, 0);
}
