
import { GoogleGenAI } from "@google/genai";

// Initialize the Google AI client once with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Translates a given text into English using the Gemini API.
 * @param text The text to translate.
 * @param language The source language of the text (e.g., "Arabic (Iraqi)").
 * @returns A promise that resolves to the translated English text.
 */
export const translateText = async (text: string, language: string): Promise<string> => {
  if (!text) {
    throw new Error('Prompt text cannot be empty.');
  }

  try {
    const systemInstruction = `You are an expert translator specializing in creative and branding concepts.
    Translate the following logo description into concise, powerful, and descriptive English suitable for an AI image generator.
    Preserve the core branding elements, names, and keywords. Only return the translated English text, with no extra commentary or explanations.`;
    
    const content = `Translate the following text from ${language} to English: "${text}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: content,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      }
    });

    const translatedText = response.text;
    if (!translatedText) {
      throw new Error('Translation failed. The model returned an empty response.');
    }
    
    return translatedText.trim();
    
  } catch (error) {
    console.error('Detailed error from translation API:', error);
    // Provide a user-friendly error message
    if (error instanceof Error && error.message.includes('API key not valid')) {
      throw new Error('The provided API Key is not valid. Please check your environment configuration.');
    }
    throw new Error('Failed to translate the prompt. Please check the developer console for more details.');
  }
};


/**
 * Generates a logo image using the Gemini API.
 * @param prompt The text prompt describing the desired logo.
 * @returns A promise that resolves to the base64 encoded image string.
 */
export const generateLogoImage = async (prompt: string): Promise<string> => {
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
        if (error.message.includes('API key not valid')) {
            throw new Error('The API key is not valid. Please check your environment configuration.');
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
    
    // For any other error, provide a generic message.
    throw new Error('Failed to generate logo. Check the developer console for more details.');
  }
};
