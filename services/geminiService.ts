
import { GoogleGenAI } from "@google/genai";

// Initialize the Google AI client once and reuse it.
// The API key is sourced from environment variables for security.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a logo image using the Gemini API.
 * @param prompt The text prompt describing the desired logo.
 * @returns A promise that resolves to the base64 encoded image string.
 */
export const generateLogoImage = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error('API Key is missing. Please ensure it is configured in the environment variables.');
  }

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
    console.error('Detailed error from Gemini API:', error);
    
    if (error instanceof Error) {
        // More generic error messages since the key source is now hidden from the user.
        if (error.message.toLowerCase().includes('billing')) {
            throw new Error('Project billing issue. Please check the associated Google Cloud account.');
        }
        if (error.message.toLowerCase().includes('permission denied') || error.message.includes('api key not valid')) {
            throw new Error('API permission denied. The configured API key may be invalid or lack necessary permissions.');
        }
         if (error.message.toLowerCase().includes('quota')) {
            throw new Error('You have exceeded your API quota. Please check your usage limits.');
        }
    }
    
    // For any other error, provide a generic message.
    throw new Error('Failed to generate logo. Check the developer console (F12) for more details.');
  }
};


/**
 * Translates a given text to a target language using the Gemini API.
 * @param text The text to translate.
 * @param targetLanguage The language to translate the text into.
 * @returns A promise that resolves to the translated text string.
 */
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
   if (!process.env.API_KEY) {
    throw new Error('API Key is missing. Please ensure it is configured in the environment variables.');
  }
  
  try {
    const prompt = `Translate the following text to ${targetLanguage}. Return ONLY the translated text, without any introductory phrases, explanations, or quotation marks around the result: "${text}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();

  } catch (error) {
    console.error('Detailed error from Gemini API during translation:', error);
    throw new Error('Failed to translate text. Please try again or check the console for details.');
  }
};
