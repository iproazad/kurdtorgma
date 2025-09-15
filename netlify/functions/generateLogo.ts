import { GoogleGenAI } from "@google/genai";

// A minimal type for the Netlify Function event.
interface NetlifyEvent {
  body: string | null;
}

interface NetlifyResponse {
  statusCode: number;
  body: string;
  headers?: { [key: string]: string };
}

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing request body" }),
    };
  }

  // Use API_KEY to be consistent with Gemini guidelines and other functions.
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key is not configured on the server." }),
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt is missing from the request body." }),
      };
    }
    
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const image = response.generatedImages[0];
      if (image.image?.imageBytes) {
         return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageB64: image.image.imageBytes }),
        };
      }
    }
    
    // Throw a more specific error if no image is in the response.
    throw new Error('No image was generated. The response might have been blocked due to safety policies.');

  } catch (error) {
    console.error('Error in generateLogo function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown internal error occurred.';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to generate logo: ${errorMessage}` }),
    };
  }
};
