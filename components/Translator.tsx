
import React, { useState, useCallback } from 'react';
import { translateText } from '../services/geminiService.ts';
import Spinner from './Spinner.tsx';

const LANGUAGES = [
  { key: 'iraqi arabic', name: 'Arabic (Iraqi)' },
  { key: 'sorani kurdish', name: 'Kurdish (Sorani)' },
  { key: 'badini kurdish', name: 'Kurdish (Badini)' },
  { key: 'kurmanji kurdish', name: 'Kurdish (Kurmanji)' },
];

const Translator: React.FC = () => {
  const [textToTranslate, setTextToTranslate] = useState<string>('');
  const [targetLanguage, setTargetLanguage] = useState<string>(LANGUAGES[0].key);
  const [translationResult, setTranslationResult] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const handleTranslate = useCallback(async () => {
    if (!textToTranslate) {
      setTranslationError('Please enter text to translate.');
      return;
    }
    setIsTranslating(true);
    setTranslationError(null);
    setTranslationResult('');

    try {
      const result = await translateText(textToTranslate, targetLanguage);
      setTranslationResult(result);
    } catch (err) {
      setTranslationError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  }, [textToTranslate, targetLanguage]);
  
  const copyToClipboard = () => {
    if (translationResult) {
      navigator.clipboard.writeText(translationResult).catch(err => console.error('Failed to copy text: ', err));
    }
  };

  return (
    <div className="mt-8 bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-6">
        Instant Translator
      </h2>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Input & Controls */}
        <div className="lg:w-1/2 flex flex-col space-y-6">
          <div>
            <label htmlFor="text-to-translate" className="block text-sm font-medium text-indigo-300 mb-2">
              1. Enter text to translate
            </label>
            <textarea
              id="text-to-translate"
              rows={4}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 transition duration-200 placeholder-gray-500"
              placeholder="Type or paste your text here..."
              value={textToTranslate}
              onChange={(e) => setTextToTranslate(e.target.value)}
              aria-label="Text to translate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-300 mb-2">
              2. Choose a language
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.key}
                  onClick={() => setTargetLanguage(lang.key)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${
                    targetLanguage === lang.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }`}
                  aria-pressed={targetLanguage === lang.key}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleTranslate}
            disabled={isTranslating || !textToTranslate}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {isTranslating ? (
              <>
                <Spinner />
                Translating...
              </>
            ) : (
              '🌐 Translate Text'
            )}
          </button>
        </div>

        {/* Right Side: Output */}
        <div className="lg:w-1/2 flex flex-col items-center justify-center bg-gray-900 p-6 rounded-lg border border-dashed border-gray-600 min-h-[220px]">
          {isTranslating && (
            <div role="status" className="text-center">
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Translating your text...</p>
            </div>
          )}
          {translationError && (
            <div role="alert" className="text-center text-red-400">
              <p><strong>Translation Failed</strong></p>
              <p className="text-sm">{translationError}</p>
            </div>
          )}
          {translationResult && !isTranslating && (
             <div className="w-full text-left">
              <div className="flex justify-between items-center mb-2">
                 <h3 className="text-lg font-semibold text-indigo-300">Translation:</h3>
                 <button onClick={copyToClipboard} className="text-gray-400 hover:text-white" title="Copy to clipboard" aria-label="Copy translated text">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                   </svg>
                 </button>
              </div>
              <p className="text-gray-200 bg-gray-800 p-4 rounded-md whitespace-pre-wrap">{translationResult}</p>
            </div>
          )}
          {!isTranslating && !translationResult && !translationError && (
            <div className="text-center text-gray-500">
              <p>Your translation will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Translator;
