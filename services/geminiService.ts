
import { GoogleGenAI } from "@google/genai";

/**
 * Generates a logo image using the Gemini API.
 * @param prompt The text prompt describing the desired logo.
 * @returns A promise that resolves to the base64 encoded image string.
 */
export const generateLogoImage = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured. Please contact the administrator.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png', // Use PNG for better quality and potential transparency
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const image = response.generatedImages[0];
      if (image.image?.imageBytes) {
        return image.image.imageBytes;
      }
    }
    
    throw new Error('No image was generated. The response might have been blocked due to safety policies.');

  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error('The configured API key is not valid. Please contact the administrator.');
    }
    throw new Error('Failed to generate logo. This could be due to safety policies or an invalid prompt.');
  }
};

/**
 * Translates text into a specified language/dialect using the Gemini API.
 * @param text The text to translate.
 * @param targetLanguage The target language or dialect.
 * @returns A promise that resolves to the translated text string.
 */
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured. Please contact the administrator.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Translate the following text to ${targetLanguage}. Provide only the translated text, without any additional explanations or introductory phrases.

Text to translate:
"${text}"`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text.trim();

  } catch (error) {
    console.error('Error translating text with Gemini:', error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error('The configured API key is not valid. Please contact the administrator.');
    }
    throw new Error('Failed to translate text. This could be due to safety policies or an unknown error.');
  }
};
