import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header.tsx';
import Spinner from './components/Spinner.tsx';
import LanguageSelector from './components/LanguageSelector.tsx';
import { translateText } from './services/geminiService.ts';
import { useLanguage } from './contexts/LanguageContext.tsx';

const TRANSLATION_LANGUAGES = [
  { code: 'auto', nameKey: 'language.detect' },
  { code: 'en', nameKey: 'English' },
  { code: 'ar', nameKey: 'Arabic' },
  { code: 'ckb', nameKey: 'Kurdish (Sorani)' },
  { code: 'kmr', nameKey: 'Kurdish (Bahdini)' },
  { code: 'es', nameKey: 'Spanish' },
  { code: 'fr', nameKey: 'French' },
  { code: 'de', nameKey: 'German' },
  { code: 'ja', nameKey: 'Japanese' },
  { code: 'ru', nameKey: 'Russian' },
  { code: 'zh', nameKey: 'Chinese' },
];

const App: React.FC = () => {
  const { t, language } = useLanguage();
  
  const [inputText, setInputText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [sourceLang, setSourceLang] = useState<string>('auto');
  const [targetLang, setTargetLang] = useState<string>('ar');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.lang = language;
    const isRtl = ['ar-IQ', 'ckb-IQ', 'kmr-IQ'].includes(language);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language]);

  // Fix: Adhered to Gemini API guidelines by removing API key management from the UI.
  // The API key is now expected to be in `process.env.API_KEY`.
  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) {
      return;
    }
    setIsLoading(true);
    setError(null);
    setTranslatedText('');

    try {
      const result = await translateText(inputText, sourceLang, targetLang);
      setTranslatedText(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, sourceLang, targetLang, t]);

  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') return; // Cannot swap with "Detect Language"
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto relative">
        <LanguageSelector />
        <Header />

        <main className="mt-6 bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center">
                {/* Source Language */}
                <div className="flex flex-col gap-2">
                    <select
                        value={sourceLang}
                        onChange={e => setSourceLang(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    >
                       {TRANSLATION_LANGUAGES.map(({ code, nameKey }) => (
                         // Fix: The `t` function expects only one argument.
                         <option key={code} value={code}>{t(nameKey)}</option>
                       ))}
                    </select>
                    <textarea
                        rows={6}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-500"
                        placeholder={t('translator.placeholder')}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                </div>
                {/* Target Language */}
                <div className="flex flex-col gap-2">
                    <select
                         value={targetLang}
                         onChange={e => setTargetLang(e.target.value)}
                         className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    >
                        {TRANSLATION_LANGUAGES.filter(l => l.code !== 'auto').map(({ code, nameKey }) => (
                         // Fix: The `t` function expects only one argument.
                         <option key={code} value={code}>{t(nameKey)}</option>
                       ))}
                    </select>
                     <div className="w-full h-full bg-gray-900 border border-dashed border-gray-600 rounded-lg p-3 text-gray-300 min-h-[158px]">
                        {isLoading ? <span className="opacity-50">{t('translator.translatingButton')}</span> : translatedText || <span className="opacity-50">{t('translator.translation')}</span>}
                     </div>
                </div>
            </div>
             {error && (
                <div className="mt-4 text-center text-red-400">
                  <p><strong>{t('error.title')}</strong></p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
            <div className="mt-6 flex flex-col items-center">
                <button
                    onClick={handleTranslate}
                    // Fix: Removed API key from disabled logic.
                    disabled={isLoading || !inputText.trim()}
                    className="w-full max-w-xs bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    {isLoading ? (
                    <>
                        <Spinner />
                        {t('translator.translatingButton')}
                    </>
                    ) : (
                    t('translator.translateButton')
                    )}
                </button>
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;
