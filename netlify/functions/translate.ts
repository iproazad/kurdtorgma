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

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key is not configured on the server." }),
    };
  }

  try {
    const { text, targetLanguage } = JSON.parse(event.body);

    if (!text || !targetLanguage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'text' or 'targetLanguage' in request body." }),
      };
    }
    
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Translate the following text to ${targetLanguage}. Provide only the translated text, without any additional explanations or introductory phrases.

Text to translate:
"${text}"`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    const translation = response.text.trim();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ translation }),
    };

  } catch (error) {
    console.error('Error in translate function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown internal error occurred.';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to translate text: ${errorMessage}` }),
    };
  }
};
