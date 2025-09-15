/**
 * Generates a logo image by calling our Netlify serverless function.
 * @param prompt The text prompt describing the desired logo.
 * @returns A promise that resolves to the base64 encoded image string.
 */
export const generateLogoImage = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('/api/generateLogo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Use the error message from the serverless function's response
      throw new Error(data.error || 'An unknown error occurred while generating the logo.');
    }
    
    if (!data.imageB64) {
      throw new Error('The server did not return an image.');
    }

    return data.imageB64;

  } catch (error) {
    console.error('Error calling generateLogo function:', error);
    // Re-throw the error to be caught by the UI component
    throw error;
  }
};

/**
 * Translates text by calling our Netlify serverless function.
 * @param text The text to translate.
 * @param targetLanguage The target language or dialect.
 * @returns A promise that resolves to the translated text string.
 */
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
   try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLanguage }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Use the error message from the serverless function's response
      throw new Error(data.error || 'An unknown error occurred during translation.');
    }
    
    if (typeof data.translation !== 'string') {
        throw new Error('The server did not return a valid translation.');
    }

    return data.translation;

  } catch (error) {
    console.error('Error calling translate function:', error);
    // Re-throw the error to be caught by the UI component
    throw error;
  }
};
