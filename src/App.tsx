import { useState, useEffect, useCallback, FormEvent, ChangeEvent } from 'react';
import { Language, HistoryItem } from './types';
import * as geminiService from './gemini.service';

const languages: Language[] = [
  { code: 'en', name: 'الإنجليزية' },
  { code: 'ar', name: 'العربية (فصحى)' },
  { code: 'ar-IQ', name: 'العربية (لهجة عراقية)' },
  { code: 'ku-sorani', name: 'الكردية (سوراني)' },
  { code: 'ku-badini', name: 'الكردية (باديني)' },
  { code: 'ku-kurmanji', name: 'الكردية (كرمانجي)' },
  { code: 'fr', name: 'الفرنسية' },
  { code: 'es', name: 'الإسبانية' },
  { code: 'de', name: 'الألمانية' },
  { code: 'tr', name: 'التركية' },
];

function App() {
  // --- State ---
  const [apiKey, setApiKey] = useState('');
  const [apiKeySet, setApiKeySet] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ar-IQ');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSpelling, setIsCheckingSpelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spellCheckSuccess, setSpellCheckSuccess] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  // --- Effects ---
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('translationHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }

    const storedKey = sessionStorage.getItem('geminiApiKey');
    if (storedKey) {
      if (geminiService.initialize(storedKey)) {
        setApiKeySet(true);
      } else {
        sessionStorage.removeItem('geminiApiKey');
      }
    }
  }, []);

  // --- Helper Functions ---
  const saveHistory = useCallback((newHistory: HistoryItem[]) => {
    try {
      localStorage.setItem('translationHistory', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, []);

  const addHistoryItem = useCallback((item: HistoryItem) => {
    setHistory(current => {
      const newHistory = [item, ...current].slice(0, 50);
      saveHistory(newHistory);
      return newHistory;
    });
  }, [saveHistory]);

  // --- Event Handlers ---
  const handleSaveApiKey = async (e: FormEvent) => {
    e.preventDefault();
    setApiKeyError(null);
    const key = apiKey.trim();
    if (!key) {
      setApiKeyError('يرجى إدخال مفتاح API صالح.');
      return;
    }

    if (geminiService.initialize(key)) {
      try {
        await geminiService.verifyApiKey();
        sessionStorage.setItem('geminiApiKey', key);
        setApiKeySet(true);
      } catch (err) {
        setApiKeyError('المفتاح الذي أدخلته غير صالح أو حدث خطأ في الشبكة. يرجى التحقق منه.');
        console.error(err);
      }
    } else {
      setApiKeyError('فشل تهيئة خدمة Gemini. يرجى التحقق من المفتاح والمحاولة مرة أخرى.');
    }
  };

  const handleTranslation = async () => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTranslatedText('');

    try {
      const sourceLangName = languages.find(l => l.code === sourceLang)?.name || 'English';
      const targetLangName = languages.find(l => l.code === targetLang)?.name || 'Arabic (Iraqi dialect)';
      
      const result = await geminiService.translateText(sourceText, sourceLangName, targetLangName);
      setTranslatedText(result);

      addHistoryItem({
        sourceText,
        translatedText: result,
        sourceLang,
        targetLang,
        sourceLangName,
        targetLangName,
        timestamp: Date.now()
      });
    } catch (e) {
      setError('حدث خطأ أثناء الترجمة. يرجى المحاولة مرة أخرى.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpellCheck = async () => {
    if (!sourceText.trim()) return;

    setIsCheckingSpelling(true);
    setError(null);
    setSpellCheckSuccess(null);

    try {
      const sourceLangName = languages.find(l => l.code === sourceLang)?.name || 'English';
      const correctedText = await geminiService.spellCheckText(sourceText, sourceLangName);
      setSourceText(correctedText);
      if (sourceText !== correctedText) {
        setSpellCheckSuccess('تم تصحيح النص بنجاح!');
      } else {
        setSpellCheckSuccess('النص صحيح ولا يحتاج لتعديل.');
      }
      setTimeout(() => setSpellCheckSuccess(null), 3000);
    } catch (e) {
      setError('حدث خطأ أثناء التدقيق الإملائي. يرجى المحاولة مرة أخرى.');
      console.error(e);
    } finally {
      setIsCheckingSpelling(false);
    }
  };
  
  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyToClipboard = () => {
    if (!translatedText || isCopied) return;
    navigator.clipboard.writeText(translatedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text to clipboard:', err);
      setError('فشل نسخ النص إلى الحافظة.');
      setTimeout(() => setError(null), 3000);
    });
  };

  const reuseTranslation = (item: HistoryItem) => {
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    setSourceText(item.sourceText);
    setTranslatedText(item.translatedText);
    setIsHistoryVisible(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const deleteHistoryItem = (timestamp: number) => {
    setHistory(current => {
      const newHistory = current.filter(item => item.timestamp !== timestamp);
      saveHistory(newHistory);
      return newHistory;
    });
  };
  
  const clearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  const formatTimestamp = (timestamp: number): string => new Date(timestamp).toLocaleString('ar-IQ');

  if (!apiKeySet) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-gray-800 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl animate-fade-in">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-white">مطلوب مفتاح Gemini API</h2>
            <p className="mt-2 text-sm text-slate-400">
              لاستخدام المترجم، يرجى إدخال مفتاح Gemini API الخاص بك. سيتم حفظه بأمان في هذه الجلسة فقط.
            </p>
          </div>
          <form onSubmit={handleSaveApiKey} className="mt-6">
            <div>
              <label htmlFor="api-key" className="sr-only">Gemini API Key</label>
              <input id="api-key" name="api-key" type="password"
                     value={apiKey} onChange={(e: ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
                     placeholder="أدخل مفتاح API هنا"
                     className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white text-center focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
            </div>
            {apiKeyError && <p className="mt-2 text-sm text-red-400 text-center">{apiKeyError}</p>}
            <div className="mt-6">
              <button type="submit"
                      className="w-full px-8 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white font-bold rounded-lg text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 flex items-center justify-center gap-2">
                <span>حفظ ومتابعة</span>
              </button>
            </div>
          </form>
          <p className="mt-6 text-xs text-slate-500 text-center">
            يمكنك الحصول على مفتاح API من Google AI Studio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white flex flex-col items-center justify-center p-4 animate-fade-in">
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m4 0v2M3 17h12M9 15v2M4 11h16M12 11v10m-8-5h12a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2a2 2 0 002 2z" />
          </svg>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">مترجم اللغات الفوري</h1>
        </div>
        <p className="text-lg text-slate-400 mt-2">ترجمة دقيقة وفورية بين اللغات واللهجات المختلفة</p>
      </header>

      <main className="w-full max-w-4xl bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center mb-6">
          <div>
            <label htmlFor="source-lang" className="block text-sm font-medium text-slate-300 mb-2">من:</label>
            <select id="source-lang" name="source-lang" value={sourceLang} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSourceLang(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition">
              {languages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
            </select>
          </div>
          <div className="flex justify-center mt-0 md:mt-7">
            <button onClick={swapLanguages} title="تبديل اللغات" className="p-2 rounded-full bg-slate-700 hover:bg-cyan-500 text-slate-300 hover:text-white transition-all duration-300 transform hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>
          <div>
            <label htmlFor="target-lang" className="block text-sm font-medium text-slate-300 mb-2">إلى:</label>
            <select id="target-lang" name="target-lang" value={targetLang} onChange={(e: ChangeEvent<HTMLSelectElement>) => setTargetLang(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition">
              {languages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <textarea value={sourceText} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSourceText(e.target.value)}
                      placeholder="اكتب النص هنا..."
                      className="w-full h-48 md:h-64 p-4 bg-slate-800/60 border border-slate-700 rounded-lg resize-none text-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"></textarea>
            <span className="absolute bottom-3 left-3 text-xs text-slate-500">{sourceText.length} / 5000</span>
          </div>
          <div className="relative w-full h-48 md:h-64 p-4 bg-slate-800/60 border border-slate-700 rounded-lg text-lg text-slate-100 overflow-y-auto">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
              </div>
            )}
            {!isLoading && translatedText && (
              <>
                <p className="whitespace-pre-wrap">{translatedText}</p>
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {isCopied && <span className="text-sm text-green-400 transition-opacity duration-300">تم النسخ!</span>}
                  <button onClick={copyToClipboard} disabled={isCopied} title="نسخ إلى الحافظة"
                          className="p-1.5 rounded-md bg-slate-700/50 hover:bg-cyan-600/70 text-slate-300 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 disabled:cursor-wait disabled:hover:bg-slate-700/50">
                    {isCopied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </>
            )}
            {!isLoading && !translatedText && <span className="text-slate-500">الترجمة...</span>}
          </div>
        </div>
        
        <div className="mt-6 flex flex-col items-center gap-4">
            {spellCheckSuccess && (
                <div className="text-sm text-green-300 bg-green-900/40 border border-green-700 rounded-lg px-4 py-2 transition-opacity duration-300">
                {spellCheckSuccess}
                </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button onClick={handleSpellCheck} disabled={isCheckingSpelling || !sourceText.trim()}
                        className="w-full sm:w-auto px-8 py-3 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-lg text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-500/50 flex items-center justify-center gap-2">
                {isCheckingSpelling ? (
                    <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري التدقيق...</span>
                    </>
                ) : (
                    <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>تدقيق إملائي</span>
                    </>
                )}
                </button>
                <button onClick={handleTranslation} disabled={isLoading || !sourceText.trim()}
                        className="w-full sm:w-auto px-10 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-lg text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 flex items-center justify-center gap-2">
                {isLoading ? (
                    <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري الترجمة...</span>
                    </>
                ) : (
                    <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>ترجمة</span>
                    </>
                )}
                </button>
            </div>
            {error && (
                <div className="text-center text-red-400 bg-red-900/50 border border-red-700 rounded-lg px-4 py-2">
                {error}
                </div>
            )}
        </div>

        <div className="mt-6 text-center">
            <button onClick={() => setIsHistoryVisible(!isHistoryVisible)} className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-md px-3 py-1">
            {isHistoryVisible ? (
                <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                <span>إخفاء سجل الترجمة</span>
                </>
            ) : (
                <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                <span>عرض سجل الترجمة</span>
                </>
            )}
            </button>
        </div>

        {isHistoryVisible && (
            <section className="mt-8 border-t border-white/10 pt-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-slate-200">سجل الترجمة</h2>
                    {history.length > 0 && (
                        <button onClick={clearHistory} className="inline-flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md px-2 py-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>مسح السجل</span>
                        </button>
                    )}
                </div>
                {history.length === 0 ? (
                    <div className="text-center text-slate-400 py-8 bg-slate-800/30 rounded-lg">
                        <p>لا يوجد سجل ترجمة حتى الآن.</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                        {history.map((item) => (
                            <article key={item.timestamp} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-cyan-700 transition-all group">
                                <header className="flex justify-between items-start text-sm text-slate-400 mb-3">
                                <div className="font-medium">
                                    <span>{item.sourceLangName}</span>
                                    <span className="mx-1">&rarr;</span>
                                    <span>{item.targetLangName}</span>
                                </div>
                                <span className="text-xs">{formatTimestamp(item.timestamp)}</span>
                                </header>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                <p className="font-semibold text-slate-200 mb-2 md:mb-0 line-clamp-3 break-words">{item.sourceText}</p>
                                <p className="text-cyan-300 line-clamp-3 break-words">{item.translatedText}</p>
                                </div>
                                <footer className="flex justify-end gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => reuseTranslation(item)} title="إعادة الاستخدام" className="p-1.5 rounded-md bg-slate-700/50 hover:bg-cyan-600/70 text-slate-300 hover:text-white transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
                                    </svg>
                                </button>
                                <button onClick={() => deleteHistoryItem(item.timestamp)} title="حذف" className="p-1.5 rounded-md bg-slate-700/50 hover:bg-red-600/70 text-slate-300 hover:text-white transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                </footer>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        )}
      </main>

      <footer className="text-center mt-8 text-slate-500 text-sm">
        <p>مدعوم بواسطة Gemini API</p>
      </footer>
    </div>
  );
}

export default App;
