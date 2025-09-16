import { GoogleGenAI } from '@google/genai';

// --- I18n & Translations ---
const uiLanguages = [
    { code: 'ku-badini', name: 'Kurdî (Badînî)' },
    { code: 'ku-sorani', name: 'کوردی (سۆرانی)' },
    { code: 'ku-kurmanji', name: 'Kurdî (Kurmancî)' },
    { code: 'ar', name: 'العربية' },
    { code: 'en', name: 'English' },
];

const translations = {
    // App Header & Footer
    mainTitle: { 'ku-badini': 'وەرگێڕێ زمانان یێ بلەز', 'ku-sorani': 'وەرگێڕی زمانی خێرا', 'ku-kurmanji': 'Wergêrê Zimanê Yê Lezgîn', 'ar': 'مترجم اللغات الفوري', 'en': 'Instant Language Translator' },
    mainSubtitle: { 'ku-badini': 'وەرگێڕانا دروست و بلەز دناڤبەرا زمان و زاراڤێن جودا دا', 'ku-sorani': 'وەرگێڕانی ورد و خێرا لەنێوان زمان و شێوەزارە جیاوازەکاندا', 'ku-kurmanji': 'Wergerandina rast û lezgîn di navbera ziman û zaravayên cuda de', 'ar': 'ترجمة دقيقة وفورية بين اللغات واللهجات المختلفة', 'en': 'Accurate and instant translation between different languages and dialects' },
    poweredBy: { 'ku-badini': 'ب پشتەڤانیا Gemini API', 'ku-sorani': 'بە پاڵپشتی Gemini API', 'ku-kurmanji': 'Ji hêla Gemini API ve tê hêz kirin', 'ar': 'مدعوم بواسطة Gemini API', 'en': 'Powered by Gemini API' },
    // UI Language Selector
    uiLangLabel: { 'ku-badini': 'گوهۆڕینا زمانێ', 'ku-sorani': 'گۆڕینی زمان', 'ku-kurmanji': 'Ziman biguherîne', 'ar': 'تغيير اللغة', 'en': 'Change Language' },
    // API Status
    apiKeyActive: { 'ku-badini': 'کلیلا API چالاکە', 'ku-sorani': 'کلیلی API کارایە', 'ku-kurmanji': 'Mifteya API çalak e', 'ar': 'مفتاح API نشط', 'en': 'API Key is active' },
    // Language Selectors
    fromLabel: { 'ku-badini': 'ژ:', 'ku-sorani': 'لە:', 'ku-kurmanji': 'Ji:', 'ar': 'من:', 'en': 'From:' },
    toLabel: { 'ku-badini': 'بۆ:', 'ku-sorani': 'بۆ:', 'ku-kurmanji': 'Bo:', 'ar': 'إلى:', 'en': 'To:' },
    swapButtonTitle: { 'ku-badini': 'گوهۆرینا زمانان', 'ku-sorani': 'گۆڕینەوەی زمانەکان', 'ku-kurmanji': 'Zimanan biguherîne', 'ar': 'تبديل اللغات', 'en': 'Swap languages' },
    swapButtonDisabledTitle: { 'ku-badini': 'دەمێ دەستنیشانکرنا زمانى یا ئۆتۆماتیکى، زمان ناهێنە گوهۆرین', 'ku-sorani': 'ناتوانرێت زمانەکان بگۆڕدرێتەوە لەکاتی بەکارهێنانی دیاریکردنی ئۆتۆماتیکی', 'ku-kurmanji': 'Dema tespîtkirina otomatîk tê bikar anîn nabe ku ziman werin guheztin', 'ar': 'لا يمكن تبديل اللغات عند استخدام اكتشاف اللغة', 'en': 'Cannot swap languages when auto-detect is used' },
    // Text Areas
    sourcePlaceholder: { 'ku-badini': 'دەقی ل ڤێرە بنڤیسە...', 'ku-sorani': 'دەق لێرە بنووسە...', 'ku-kurmanji': 'Nivîsê li vir binivîse...', 'ar': 'اكتب النص هنا...', 'en': 'Enter text here...' },
    translationPlaceholder: { 'ku-badini': 'وەرگێڕان...', 'ku-sorani': 'وەرگێڕان...', 'ku-kurmanji': 'Werger...', 'ar': 'الترجمة...', 'en': 'Translation...' },
    // Main Action Buttons
    translateButton: { 'ku-badini': 'وەرگێڕان', 'ku-sorani': 'وەرگێڕان', 'ku-kurmanji': 'Wergerîne', 'ar': 'ترجمة', 'en': 'Translate' },
    translatingButton: { 'ku-badini': 'یێ د وەرگێڕانێ دا...', 'ku-sorani': 'وەرگێڕان لە پرۆسەدایە...', 'ku-kurmanji': 'Tê wergerandin...', 'ar': 'جاري الترجمة...', 'en': 'Translating...' },
    spellCheckButton: { 'ku-badini': 'پێداچوونا ڕێنڤیسێ', 'ku-sorani': 'پێداچوونەوەی ڕێنووس', 'ku-kurmanji': 'Rastnivîsînê kontrol bike', 'ar': 'تدقيق إملائي', 'en': 'Spell Check' },
    spellCheckingButton: { 'ku-badini': 'یێ د پێداچوونێ دا...', 'ku-sorani': 'پێداچوونەوە لە پرۆسەدایە...', 'ku-kurmanji': 'Tê kontrolkirin...', 'ar': 'جاري التدقيق...', 'en': 'Checking...' },
    clearAllButton: { 'ku-badini': 'هەمى پاک بکە', 'ku-sorani': 'سڕینەوەی هەموو', 'ku-kurmanji': 'Hemî paqij bike', 'ar': 'مسح الكل', 'en': 'Clear All' },
    // Copy button
    copyButtonTitle: { 'ku-badini': 'کۆپیکرن بۆ کلیپبوردێ', 'ku-sorani': 'کۆپیکردن بۆ کلیپبۆرد', 'ku-kurmanji': 'Li clipboardê kopî bike', 'ar': 'نسخ إلى الحافظة', 'en': 'Copy to clipboard' },
    copiedSuccessMessage: { 'ku-badini': 'هاتە کۆپیکرن!', 'ku-sorani': 'کۆپی کرا!', 'ku-kurmanji': 'Hate kopî kirin!', 'ar': 'تم النسخ!', 'en': 'Copied!' },
    // Clear buttons
    clearSourceButtonTitle: { 'ku-badini': 'دەقی ژێببە', 'ku-sorani': 'سڕینەوەی دەق', 'ku-kurmanji': 'Nivîsê paqij bike', 'ar': 'مسح النص', 'en': 'Clear text' },
    clearTranslatedButtonTitle: { 'ku-badini': 'وەرگێڕانێ ژێببە', 'ku-sorani': 'سڕینەوەی وەرگێڕان', 'ku-kurmanji': 'Wergerê paqij bike', 'ar': 'مسح الترجمة', 'en': 'Clear translation' },
    // Messages
    spellCheckSuccess: { 'ku-badini': 'دەق ب سەرکەفتیانە هاتە ڕاستکرن!', 'ku-sorani': 'دەق بە سەرکەوتوویی ڕاستکرایەوە!', 'ku-kurmanji': 'Nivîs bi serkeftî hate rast kirin!', 'ar': 'تم تصحيح النص بنجاح!', 'en': 'Text corrected successfully!' },
    spellCheckNoChange: { 'ku-badini': 'دەق دروستە و پێدڤی ب چاککرنێ نینە.', 'ku-sorani': 'دەقەکە ڕاستە و پێویستی بە گۆڕانکاری نییە.', 'ku-kurmanji': 'Nivîs rast e û pêdivî bi sererastkirinê nîne.', 'ar': 'النص صحيح ولا يحتاج لتعديل.', 'en': 'The text is correct and needs no changes.' },
    errorTranslation: { 'ku-badini': 'د دەما وەرگێڕانێ دا شاشییەک ڕوویدا. تکایە دوبارە هەول بدە.', 'ku-sorani': 'هەڵەیەک لە کاتی وەرگێڕاندا ڕوویدا. تکایە دووبارە هەوڵبدەرەوە.', 'ku-kurmanji': 'Di dema wergerandinê de çewtî çêbû. Ji kerema xwe dîsa biceribîne.', 'ar': 'حدث خطأ أثناء الترجمة. يرجى المحاولة مرة أخرى.', 'en': 'An error occurred during translation. Please try again.' },
    errorSpellCheck: { 'ku-badini': 'د دەما پێداچوونێ دا شاشییەک ڕوویدا. تکایە دوبارە هەول بدە.', 'ku-sorani': 'هەڵەیەک لە کاتی پێداچوونەوەی ڕێنووسدا ڕوویدا. تکایە دووبارە هەوڵبدەرەوە.', 'ku-kurmanji': 'Di dema kontrolkirina rastnivîsînê de çewtî çêbû. Ji kerema xwe dîsa biceribîne.', 'ar': 'حدث خطأ أثناء التدقيق الإملائي. يرجى المحاولة مرة أخرى.', 'en': 'An error occurred during spell check. Please try again.' },
    errorLangDetect: { 'ku-badini': 'زمان نەهاتە دەستنیشانکرن یان پشتەڤانی لێ ناهێتە کرن. تکایە ب دەستى هەلبژێرە.', 'ku-sorani': 'نەتوانرا زمانەکە دیاری بکرێت یان پشتگیری نەکراوە. تکایە بە دەستی هەڵیبژێرە.', 'ku-kurmanji': 'Ziman nehat tespît kirin an nayê piştgirî kirin. Ji kerema xwe bi destan hilbijêre.', 'ar': 'تعذر اكتشاف اللغة أو أنها غير مدعومة. يرجى تحديدها يدوياً.', 'en': 'Could not detect language or it is not supported. Please select it manually.' },
    errorClipboard: { 'ku-badini': 'کۆپیکرنا دەقی بۆ کلیپبوردێ سەرنەکەفت.', 'ku-sorani': 'کۆپیکردنی دەق بۆ کلیپبۆرد سەرکەوتوو نەبوو.', 'ku-kurmanji': 'Kopîkirina nivîsê li clipboardê bi ser neket.', 'ar': 'فشل نسخ النص إلى الحافظة.', 'en': 'Failed to copy text to clipboard.' },
    // History Section
    showHistory: { 'ku-badini': 'تۆمارا وەرگێڕانێ نیشان بدە', 'ku-sorani': 'پیشاندانی مێژووی وەرگێڕان', 'ku-kurmanji': 'Dîroka wergerê nîşan bide', 'ar': 'عرض سجل الترجمة', 'en': 'Show Translation History' },
    hideHistory: { 'ku-badini': 'تۆمارا وەرگێڕانێ ڤەشێرە', 'ku-sorani': 'شاردنەوەی مێژووی وەرگێڕان', 'ku-kurmanji': 'Dîroka wergerê veşêre', 'ar': 'إخفاء سجل الترجمة', 'en': 'Hide Translation History' },
    historyTitle: { 'ku-badini': 'تۆمارا وەرگێڕانێ', 'ku-sorani': 'مێژووی وەرگێڕان', 'ku-kurmanji': 'Dîroka Wergerê', 'ar': 'سجل الترجمة', 'en': 'Translation History' },
    clearHistory: { 'ku-badini': 'تۆمارێ ژێببە', 'ku-sorani': 'سڕینەوەی مێژوو', 'ku-kurmanji': 'Dîrokê paqij bike', 'ar': 'مسح السجل', 'en': 'Clear History' },
    historyEmpty: { 'ku-badini': 'هێشتا چ تۆمارێن وەرگێڕانێ نینن.', 'ku-sorani': 'هێشتا هیچ مێژوویەکی وەرگێڕان نییە.', 'ku-kurmanji': 'Hîn dîroka wergerê tune.', 'ar': 'لا يوجد سجل ترجمة حتى الآن.', 'en': 'No translation history yet.' },
    historyReuseTitle: { 'ku-badini': 'دوبارە بکاربینە', 'ku-sorani': 'دووبارە بەکارهێنانەوە', 'ku-kurmanji': 'Dîsa bi kar bîne', 'ar': 'إعادة الاستخدام', 'en': 'Reuse' },
    historyDeleteTitle: { 'ku-badini': 'ژێببە', 'ku-sorani': 'سڕینەوە', 'ku-kurmanji': 'Jê bibe', 'ar': 'حذف', 'en': 'Delete' },
    // Confirmation dialogs
    confirmClearAll: { 'ku-badini': 'تو پشتراستی دخوازی دەقێ ژێدەر و وەرگێڕانێ ژێببەی؟ کاریگەری ل سەر تۆمارا تە نابیت.', 'ku-sorani': 'دڵنیایت کە دەتەوێت دەقی سەرچاوە و وەرگێڕان بسڕیتەوە؟ کاریگەری لەسەر مێژووەکەت نابێت.', 'ku-kurmanji': 'Ma tu piştrast î ku dixwazî nivîsa çavkanî û wergerê paqij bikî? Ev ê bandorê li dîroka te neke.', 'ar': 'هل أنت متأكد أنك تريد مسح النص المصدر والترجمة؟ لن يتأثر سجل الترجمة.', 'en': 'Are you sure you want to clear the source and translated text? Your history will not be affected.' },
    confirmClearHistory: { 'ku-badini': 'تو پشتراستی دخوازی تۆمارا وەرگێڕانێ ژێببەی؟', 'ku-sorani': 'دڵنیایت کە دەتەوێت مێژووی وەرگێڕان بسڕیتەوە؟', 'ku-kurmanji': 'Ma tu piştrast î ku dixwazî dîroka wergerê paqij bikî?', 'ar': 'هل أنت متأكد أنك تريد مسح سجل الترجمة؟', 'en': 'Are you sure you want to clear the translation history?' },
    // API Key Modal
    apiKeyTitle: { 'ku-badini': 'کلیلا Gemini API پێدڤیە', 'ku-sorani': 'کلیلی Gemini API پێویستە', 'ku-kurmanji': 'Mifteya Gemini API hewce ye', 'ar': 'مطلوب مفتاح Gemini API', 'en': 'Gemini API Key Required' },
    apiKeyDescription: { 'ku-badini': 'بۆ بکارئینانا وەرگێڕی، تکایە کلیلا خوە یا Gemini API داخل بکە. دێ ب شێوەکێ پاراستی د وەرگەرێ تە دا هێتە پاشکەفتن بۆ بکارئینانێن داهاتى.', 'ku-sorani': 'بۆ بەکارهێنانی وەرگێڕ، تکایە کلیلی Gemini APIـیەکەت بنووسە. بە شێوەیەکی پارێزراو لە وێبگەڕەکەتدا هەڵدەگیرێت بۆ بەکارهێنانەکانی داهاتوو.', 'ku-kurmanji': 'Ji bo bikaranîna wergêr, ji kerema xwe mifteya xwe ya Gemini API binivîse. Ew ê di geroka we de ji bo karanîna paşerojê bi ewlehî were hilanîn.', 'ar': 'لاستخدام المترجم، يرجى إدخال مفتاح Gemini API الخاص بك. سيتم حفظه بأمان في متصفحك للاستخدامات المستقبلية.', 'en': 'To use the translator, please enter your Gemini API key. It will be saved securely in your browser for future use.' },
    apiKeyInputPlaceholder: { 'ku-badini': 'کلیلا API ل ڤێرە داخل بکە', 'ku-sorani': 'کلیلی API لێرە بنووسە', 'ku-kurmanji': 'Mifteya API li vir binivîse', 'ar': 'أدخل مفتاح API هنا', 'en': 'Enter API key here' },
    apiKeySaveButton: { 'ku-badini': 'پاشکەفتن و بەردەوامی', 'ku-sorani': 'پاشەکەوتکردن و بەردەوامبوون', 'ku-kurmanji': 'Tomar bike û bidomîne', 'ar': 'حفظ ومتابعة', 'en': 'Save and Continue' },
    apiKeyGetLink: { 'ku-badini': 'تو دشێی کلیلا API ژ Google AI Studio بدەست بینی.', 'ku-sorani': 'دەتوانیت کلیلی API لە Google AI Studio بەدەست بهێنیت.', 'ku-kurmanji': 'Tu dikarî mifteya API ji Google AI Studio bistînî.', 'ar': 'يمكنك الحصول على مفتاح API من Google AI Studio.', 'en': 'You can get an API key from Google AI Studio.' },
    apiKeyErrorInvalid: { 'ku-badini': 'کلیلا داخلکری نە دروستە یان کێشەکا تۆڕێ هەیە. تکایە پشکنینێ بکە.', 'ku-sorani': 'کلیلی نووسراو نادروستە یان کێشەیەکی تۆڕ هەیە. تکایە پشکنینی بۆ بکە.', 'ku-kurmanji': 'Mifteya ku te nivîsî ne derbasdar e an pirsgirêkek torê heye. Ji kerema xwe kontrol bike.', 'ar': 'المفتاح الذي أدخلته غير صالح أو حدث خطأ في الشبكة. يرجى التحقق منه.', 'en': 'The key you entered is invalid or there was a network error. Please check it.' },
    apiKeyErrorMissing: { 'ku-badini': 'تکایە کلیلا API یا دروست داخل بکە.', 'ku-sorani': 'تکایە کلیلی API دروست بنووسە.', 'ku-kurmanji': 'Ji kerema xwe mifteyek API ya derbasdar binivîse.', 'ar': 'يرجى إدخال مفتاح API صالح.', 'en': 'Please enter a valid API key.' },
    apiKeyErrorInit: { 'ku-badini': 'دەستپێکرنا خزمەتا Gemini سەرنەکەفت. تکایە کلیلی پشکنینە و دوبارە هەول بدە.', 'ku-sorani': 'دەستپێکردنی خزمەتگوزاری Gemini سەرکەوتوو نەبوو. تکایە کلیلیەکە بپشکنە و دووبارە هەوڵبدەرەوە.', 'ku-kurmanji': 'Destpêkirina servîsa Gemini bi ser neket. Ji kerema xwe mifteyê kontrol bike û dîsa biceribîne.', 'ar': 'فشل تهيئة خدمة Gemini. يرجى التحقق من المفتاح والمحاولة مرة أخرى.', 'en': 'Failed to initialize Gemini service. Please check the key and try again.' },
    geminiErrorGeneric: { 'ku-badini': 'پەیوەندی ب خزمەتا Gemini سەرنەکەفت.', 'ku-sorani': 'پەیوەندیکردن بە خزمەتگوزاری Gemini سەرکەوتوو نەبوو.', 'ku-kurmanji': 'Girêdana bi servîsa Gemini re bi ser neket.', 'ar': 'فشل الاتصال بخدمة Gemini.', 'en': 'Failed to connect to Gemini service.' },
    geminiErrorInvalidApiKey: { 'ku-badini': 'کلیلا API نە دروستە. تکایە پشکنینێ بکە.', 'ku-sorani': 'کلیلی API نادروستە. تکایە پشکنینی بۆ بکە.', 'ku-kurmanji': 'Mifteya API ne derbasdar e. Ji kerema xwe kontrol bike.', 'ar': 'مفتاح API غير صالح. يرجى التحقق منه.', 'en': 'API key not valid. Please check it.' },
    // Translateable language names
    lang_auto: { 'ku-badini': 'دەستنیشانکرنا ئۆتۆماتیکی', 'ku-sorani': 'دیاریکردنی ئۆتۆماتیکی', 'ku-kurmanji': 'Tesbîtkirina otomatîk', 'ar': 'اكتشاف اللغة تلقائياً', 'en': 'Auto-detect language' },
    lang_en: { 'ku-badini': 'ئینگلیزی', 'ku-sorani': 'ئینگلیزی', 'ku-kurmanji': 'Îngilîzî', 'ar': 'الإنجليزية', 'en': 'English' },
    lang_ar: { 'ku-badini': 'عەرەبی (فەرمی)', 'ku-sorani': 'عەرەبی (فەرمی)', 'ku-kurmanji': 'Erebî (Fasih)', 'ar': 'العربية (فصحى)', 'en': 'Arabic (Standard)' },
    lang_ar_IQ: { 'ku-badini': 'عەرەبی (زاراڤێ عیراقی)', 'ku-sorani': 'عەرەبی (شێوەزاری عێراقی)', 'ku-kurmanji': 'Erebî (Zaravê Iraqî)', 'ar': 'العربية (لهجة عراقية)', 'en': 'Arabic (Iraqi dialect)' },
    lang_ku_sorani: { 'ku-badini': 'کوردی (سۆرانی)', 'ku-sorani': 'کوردی (سۆرانی)', 'ku-kurmanji': 'Kurdî (Soranî)', 'ar': 'الكردية (سوراني)', 'en': 'Kurdish (Sorani)' },
    lang_ku_badini: { 'ku-badini': 'کوردی (بادینی)', 'ku-sorani': 'کوردی (بادینی)', 'ku-kurmanji': 'Kurdî (Badînî)', 'ar': 'الكردية (باديني)', 'en': 'Kurdish (Badini)' },
    lang_ku_kurmanji: { 'ku-badini': 'کوردی (کرمانجی)', 'ku-sorani': 'کوردی (کرمانجی)', 'ku-kurmanji': 'Kurdî (Kurmancî)', 'ar': 'الكردية (كرمانجي)', 'en': 'Kurdish (Kurmanji)' },
    lang_fr: { 'ku-badini': 'فرەنسی', 'ku-sorani': 'فەرەنسی', 'ku-kurmanji': 'Fransî', 'ar': 'الفرنسية', 'en': 'French' },
    lang_es: { 'ku-badini': 'ئیسپانی', 'ku-sorani': 'ئیسپانی', 'ku-kurmanji': 'Spanî', 'ar': 'الإسبانية', 'en': 'Spanish' },
    lang_de: { 'ku-badini': 'ئەلمانی', 'ku-sorani': 'ئەڵمانی', 'ku-kurmanji': 'Elmanî', 'ar': 'الألمانية', 'en': 'German' },
    lang_tr: { 'ku-badini': 'ترکی', 'ku-sorani': 'تورکی', 'ku-kurmanji': 'Tirkî', 'ar': 'التركية', 'en': 'Turkish' },
};

function t(key) {
    const lang = state.uiLang;
    if (translations[key] && translations[key][lang]) {
        return translations[key][lang];
    }
    console.warn(`Translation not found for key: ${key}, lang: ${lang}`);
    return key; // Fallback to key name
}

// --- Gemini Service ---
class GeminiService {
  ai = null;

  initialize(apiKey) {
    if (!apiKey) {
      console.error("API Key is required for initialization.");
      return false;
    }
    try {
      this.ai = new GoogleGenAI({ apiKey });
      return true;
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI:", e);
      this.ai = null;
      return false;
    }
  }

  async generateContent(prompt, temperature, thinkingBudget) {
    if (!this.ai) {
      throw new Error('geminiErrorGeneric');
    }
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature,
          ...(thinkingBudget !== undefined && { thinkingConfig: { thinkingBudget } })
        }
      });
      return response.text.trim();
    } catch (error) {
       console.error('Error calling Gemini API:', error);
       if (error.toString().includes('API key not valid')) {
         throw new Error('geminiErrorInvalidApiKey');
       }
       throw new Error('geminiErrorGeneric');
    }
  }

  async verifyApiKey() {
    await this.generateContent('hi', 0, 0);
  }

  async detectLanguage(text, languageNames) {
    const prompt = `You are a language detection expert. Identify the language of the following text. 
Respond ONLY with the language name in Arabic, exactly as it appears in this list if possible: [${languageNames.join(', ')}]. 
Do not add any introductions, explanations, or quotation marks.

Text:
"${text}"`;
    return this.generateContent(prompt, 0.1, 0);
  }

  async translateText(text, sourceLangName, targetLangName) {
    const prompt = `You are a professional translator. Translate the following text from "${sourceLangName}" to "${targetLangName}". Provide only the translated text, without any additional explanations, introductions, or quotation marks.
    
Text to translate:
"${text}"`;
    return this.generateContent(prompt, 0.3, 0);
  }

  async spellCheckText(text, sourceLangName) {
    const prompt = `You are a meticulous spell and grammar checker. Correct any spelling mistakes and grammatical errors in the following text, which is in "${sourceLangName}". Respond ONLY with the corrected text. Do not add any introductions, explanations, or quotation marks. If the text is already perfect, return it as is.

Text to correct:
"${text}"`;
    return this.generateContent(prompt, 0, 0);
  }
}

// --- Application State ---
const state = {
  geminiService: new GeminiService(),
  apiKeySet: false,
  uiLang: 'ku-badini', // Default UI language
  languages: [ 'auto', 'en', 'ar', 'ar-IQ', 'ku-sorani', 'ku-badini', 'ku-kurmanji', 'fr', 'es', 'de', 'tr' ],
  sourceLang: 'auto',
  targetLang: 'ar-IQ',
  sourceText: '',
  translatedText: '',
  isLoading: false,
  isCheckingSpelling: false,
  isCopied: false,
  history: [],
  isHistoryVisible: false,
};

// --- DOM Elements ---
const dom = {
  html: document.documentElement,
  apiKeyView: document.getElementById('api-key-view'),
  appView: document.getElementById('app-view'),
  apiKeyForm: document.getElementById('api-key-form'),
  apiKeyInput: document.getElementById('api-key-input'),
  apiKeyError: document.getElementById('api-key-error'),
  apiStatusIndicator: document.getElementById('api-status-indicator'),
  uiLangSelect: document.getElementById('ui-lang-select'),
  sourceLangSelect: document.getElementById('source-lang'),
  targetLangSelect: document.getElementById('target-lang'),
  swapLanguagesBtn: document.getElementById('swap-languages-btn'),
  sourceTextarea: document.getElementById('source-text'),
  sourceTextCounter: document.getElementById('source-text-counter'),
  translatedTextP: document.getElementById('translated-text'),
  translationPlaceholder: document.getElementById('translation-placeholder'),
  copyBtn: document.getElementById('copy-btn'),
  copyContainer: document.getElementById('copy-container'),
  copySuccessMsg: document.getElementById('copy-success-msg'),
  copyIcon: document.getElementById('copy-icon'),
  copiedIcon: document.getElementById('copied-icon'),
  loadingSpinner: document.getElementById('loading-spinner'),
  translateBtn: document.getElementById('translate-btn'),
  translateBtnContent: document.getElementById('translate-btn-content'),
  translateBtnLoading: document.getElementById('translate-btn-loading'),
  spellCheckBtn: document.getElementById('spell-check-btn'),
  spellCheckBtnContent: document.getElementById('spell-check-btn-content'),
  spellCheckBtnLoading: document.getElementById('spell-check-btn-loading'),
  spellCheckSuccessMsg: document.getElementById('spell-check-success-msg'),
  errorMsg: document.getElementById('error-msg'),
  toggleHistoryBtn: document.getElementById('toggle-history-btn'),
  showHistoryContent: document.getElementById('show-history-content'),
  hideHistoryContent: document.getElementById('hide-history-content'),
  historySection: document.getElementById('history-section'),
  historyListContainer: document.getElementById('history-list-container'),
  historyEmptyMsg: document.getElementById('history-empty-msg'),
  clearHistoryBtn: document.getElementById('clear-history-btn'),
  clearAllBtn: document.getElementById('clear-all-btn'),
  clearSourceBtn: document.getElementById('clear-source-btn'),
  clearTranslatedBtn: document.getElementById('clear-translated-btn'),
  footerText: document.querySelector('footer p'),
};

// --- Render Functions ---
function applyTranslations() {
    const lang = state.uiLang;
    const isRTL = lang === 'ar' || lang === 'ku-sorani' || lang === 'ku-badini';
    dom.html.lang = lang;
    dom.html.dir = isRTL ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        el.textContent = t(key);
    });

    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.dataset.translatePlaceholder;
        el.placeholder = t(key);
    });

    document.querySelectorAll('[data-translate-title]').forEach(el => {
        const key = el.dataset.translateTitle;
        el.title = t(key);
    });

    // Specific updates
    dom.footerText.textContent = t('poweredBy');
    populateLanguageDropdowns();
}

function populateLanguageDropdowns() {
    const currentSource = dom.sourceLangSelect.value;
    const currentTarget = dom.targetLangSelect.value;

    dom.sourceLangSelect.innerHTML = '';
    dom.targetLangSelect.innerHTML = '';
    
    state.languages.forEach(code => {
        const langName = t(`lang_${code.replace('-', '_')}`);
        dom.sourceLangSelect.add(new Option(langName, code));
        if (code !== 'auto') {
            dom.targetLangSelect.add(new Option(langName, code));
        }
    });
    
    dom.sourceLangSelect.value = currentSource;
    dom.targetLangSelect.value = currentTarget;
}


function render() {
  applyTranslations();

  // Views
  dom.apiKeyView.classList.toggle('hidden', state.apiKeySet);
  dom.appView.classList.toggle('hidden', !state.apiKeySet);
  dom.apiStatusIndicator.classList.toggle('hidden', !state.apiKeySet);
  
  // Language selectors value (already set in applyTranslations, but good to ensure)
  dom.sourceLangSelect.value = state.sourceLang;
  dom.targetLangSelect.value = state.targetLang;

  // Text areas
  if (dom.sourceTextarea.value !== state.sourceText) {
      dom.sourceTextarea.value = state.sourceText;
  }
  dom.sourceTextCounter.textContent = `${state.sourceText.length} / 5000`;
  dom.translatedTextP.textContent = state.translatedText;

  // Visibility based on translation state
  dom.loadingSpinner.classList.toggle('hidden', !state.isLoading);
  dom.translationPlaceholder.classList.toggle('hidden', state.isLoading || !!state.translatedText);
  dom.copyContainer.classList.toggle('hidden', !state.translatedText);
  
  // Clear buttons visibility
  dom.clearSourceBtn.classList.toggle('hidden', !state.sourceText.trim());
  dom.clearTranslatedBtn.classList.toggle('hidden', !state.translatedText.trim());

  // Buttons state
  const isAutoDetect = state.sourceLang === 'auto';
  dom.swapLanguagesBtn.disabled = isAutoDetect;
  dom.swapLanguagesBtn.title = isAutoDetect ? t('swapButtonDisabledTitle') : t('swapButtonTitle');

  dom.translateBtn.disabled = state.isLoading || !state.sourceText.trim();
  dom.translateBtnContent.classList.toggle('hidden', state.isLoading);
  dom.translateBtnLoading.classList.toggle('hidden', !state.isLoading);

  dom.spellCheckBtn.disabled = state.isCheckingSpelling || !state.sourceText.trim();
  dom.spellCheckBtnContent.classList.toggle('hidden', state.isCheckingSpelling);
  dom.spellCheckBtnLoading.classList.toggle('hidden', !state.isCheckingSpelling);
  
  const nothingToClear = !state.sourceText.trim() && !state.translatedText.trim();
  dom.clearAllBtn.disabled = nothingToClear;

  // Copy button state
  dom.copyBtn.disabled = state.isCopied;
  dom.copySuccessMsg.classList.toggle('hidden', !state.isCopied);
  dom.copyIcon.classList.toggle('hidden', state.isCopied);
  dom.copiedIcon.classList.toggle('hidden', !state.isCopied);

  // History section
  dom.historySection.classList.toggle('hidden', !state.isHistoryVisible);
  dom.showHistoryContent.classList.toggle('hidden', state.isHistoryVisible);
  dom.hideHistoryContent.classList.toggle('hidden', !state.isHistoryVisible);
  renderHistory();
}

function renderHistory() {
    dom.historyListContainer.innerHTML = '';
    const hasHistory = state.history.length > 0;
    dom.historyEmptyMsg.classList.toggle('hidden', hasHistory);
    dom.clearHistoryBtn.classList.toggle('hidden', !hasHistory);

    const localeForDate = state.uiLang === 'en' ? 'en-US' : state.uiLang;

    state.history.forEach(item => {
        const article = document.createElement('article');
        article.className = 'bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-cyan-700 transition-all group';
        const sourceLangName = t(`lang_${item.sourceLang.replace('-', '_')}`);
        const targetLangName = t(`lang_${item.targetLang.replace('-', '_')}`);
        
        article.innerHTML = `
            <header class="flex justify-between items-start text-sm text-slate-400 mb-3">
              <div class="font-medium">
                <span>${sourceLangName}</span>
                <span class="mx-1">&rarr;</span>
                <span>${targetLangName}</span>
              </div>
              <span class="text-xs">${new Date(item.timestamp).toLocaleString(localeForDate)}</span>
            </header>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <p class="font-semibold text-slate-200 mb-2 md:mb-0 line-clamp-3 break-words">${item.sourceText}</p>
              <p class="text-cyan-300 line-clamp-3 break-words">${item.translatedText}</p>
            </div>
            <footer class="flex justify-end gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button data-timestamp="${item.timestamp}" data-action="reuse" title="${t('historyReuseTitle')}" class="p-1.5 rounded-md bg-slate-700/50 hover:bg-cyan-600/70 text-slate-300 hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
                </svg>
              </button>
              <button data-timestamp="${item.timestamp}" data-action="delete" title="${t('historyDeleteTitle')}" class="p-1.5 rounded-md bg-slate-700/50 hover:bg-red-600/70 text-slate-300 hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </footer>
        `;
        dom.historyListContainer.appendChild(article);
    });
}

function displayError(messageKey) {
    dom.errorMsg.textContent = t(messageKey);
    dom.errorMsg.classList.remove('hidden');
    setTimeout(() => dom.errorMsg.classList.add('hidden'), 4000);
}

function displaySpellCheckSuccess(messageKey) {
    dom.spellCheckSuccessMsg.textContent = t(messageKey);
    dom.spellCheckSuccessMsg.classList.remove('hidden');
    setTimeout(() => dom.spellCheckSuccessMsg.classList.add('hidden'), 3000);
}

// --- Event Handlers ---
async function saveApiKey(event) {
  event.preventDefault();
  dom.apiKeyError.classList.add('hidden');
  const key = dom.apiKeyInput.value.trim();
  if (!key) {
    dom.apiKeyError.textContent = t('apiKeyErrorMissing');
    dom.apiKeyError.classList.remove('hidden');
    return;
  }
  
  if (state.geminiService.initialize(key)) {
    try {
      await state.geminiService.verifyApiKey();
      localStorage.setItem('geminiApiKey', key);
      state.apiKeySet = true;
      render();
    } catch (e) {
       dom.apiKeyError.textContent = t('apiKeyErrorInvalid');
       dom.apiKeyError.classList.remove('hidden');
       console.error(e);
    }
  } else {
    dom.apiKeyError.textContent = t('apiKeyErrorInit');
    dom.apiKeyError.classList.remove('hidden');
  }
}

async function handleTranslation() {
  const text = state.sourceText;
  if (!text.trim()) {
    state.translatedText = '';
    render();
    return;
  }

  state.isLoading = true;
  state.translatedText = '';
  render();

  try {
    let sourceLangCode = state.sourceLang;
    const arabicLanguageNamesForDetection = state.languages
        .filter(code => code !== 'auto')
        .map(code => `"${translations[`lang_${code.replace('-', '_')}`]['ar']}"`);

    if (sourceLangCode === 'auto') {
      const detectedLangArabicName = await state.geminiService.detectLanguage(text, arabicLanguageNamesForDetection);
      const detectedLangEntry = Object.entries(translations).find(([key, value]) => key.startsWith('lang_') && value.ar === detectedLangArabicName);

      if (!detectedLangEntry) {
        throw new Error(`Language "${detectedLangArabicName}" not supported or detection failed.`);
      }
      sourceLangCode = detectedLangEntry[0].substring(5).replace('_','-');
    }
    
    const sourceLangName = translations[`lang_${sourceLangCode.replace('-', '_')}`]['en']; // Use English name for prompt consistency
    const targetLangName = translations[`lang_${state.targetLang.replace('-', '_')}`]['en'];
    
    const result = await state.geminiService.translateText(text, sourceLangName, targetLangName);
    state.translatedText = result;

    const newHistoryItem = {
      sourceText: text,
      translatedText: result,
      sourceLang: sourceLangCode,
      targetLang: state.targetLang,
      timestamp: Date.now()
    };
    addHistoryItem(newHistoryItem);

  } catch (e) {
    if (e.message.includes("not supported")) {
        displayError('errorLangDetect');
    } else {
        displayError('errorTranslation');
    }
    console.error(e);
  } finally {
    state.isLoading = false;
    render();
  }
}

async function handleSpellCheck() {
    const text = state.sourceText;
    if (!text.trim()) return;

    state.isCheckingSpelling = true;
    render();

    try {
        let sourceLangCode = state.sourceLang;
        if (sourceLangCode === 'auto') {
            const arabicLanguageNamesForDetection = state.languages
                .filter(code => code !== 'auto')
                .map(code => `"${translations[`lang_${code.replace('-', '_')}`]['ar']}"`);
            
            const detectedLangArabicName = await state.geminiService.detectLanguage(text, arabicLanguageNamesForDetection);
            const detectedLangEntry = Object.entries(translations).find(([key, value]) => key.startsWith('lang_') && value.ar === detectedLangArabicName);

            if (!detectedLangEntry) {
                throw new Error(`Language "${detectedLangArabicName}" not supported or detection failed.`);
            }
            sourceLangCode = detectedLangEntry[0].substring(5).replace('_', '-');
            state.sourceLang = sourceLangCode;
        }

        const sourceLangName = translations[`lang_${sourceLangCode.replace('-', '_')}`]['en'];
        const correctedText = await state.geminiService.spellCheckText(text, sourceLangName);
        
        if (state.sourceText !== correctedText) {
            displaySpellCheckSuccess('spellCheckSuccess');
        } else {
            displaySpellCheckSuccess('spellCheckNoChange');
        }
        state.sourceText = correctedText;

    } catch (e) {
        if (e.message.includes("not supported")) {
            displayError('errorLangDetect');
        } else {
            displayError('errorSpellCheck');
        }
        console.error(e);
    } finally {
        state.isCheckingSpelling = false;
        render();
    }
}

function swapLanguages() {
    if (state.sourceLang === 'auto') return;
    [state.sourceLang, state.targetLang] = [state.targetLang, state.sourceLang];
    [state.sourceText, state.translatedText] = [state.translatedText, state.sourceText];
    render();
}

function copyToClipboard() {
    if (!state.translatedText || state.isCopied) return;

    navigator.clipboard.writeText(state.translatedText).then(() => {
        state.isCopied = true;
        render();
        setTimeout(() => {
            state.isCopied = false;
            render();
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text:', err);
        displayError('errorClipboard');
    });
}

function handleClearAll() {
    if (confirm(t('confirmClearAll'))) {
        state.sourceText = '';
        state.translatedText = '';
        render();
    }
}

function handleClearSourceText() {
    state.sourceText = '';
    render();
    dom.sourceTextarea.focus();
}

function handleClearTranslatedText() {
    state.translatedText = '';
    render();
}

function handleHistoryClick(event) {
    const button = event.target.closest('button');
    if (!button) return;

    const action = button.dataset.action;
    const timestamp = Number(button.dataset.timestamp);

    if (action === 'reuse') {
        const item = state.history.find(h => h.timestamp === timestamp);
        if (item) {
            state.sourceLang = item.sourceLang;
            state.targetLang = item.targetLang;
            state.sourceText = item.sourceText;
            state.translatedText = item.translatedText;
            state.isHistoryVisible = false;
            render();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } else if (action === 'delete') {
        state.history = state.history.filter(item => item.timestamp !== timestamp);
        saveHistory();
        render();
    }
}

function handleUiLangChange(event) {
    state.uiLang = event.target.value;
    localStorage.setItem('uiLang', state.uiLang);
    render();
}

// --- Persistence ---
function loadHistory() {
    try {
        const storedHistory = localStorage.getItem('translationHistory');
        if (storedHistory) {
            state.history = JSON.parse(storedHistory);
        }
    } catch (e) {
        console.error('Failed to load history', e);
    }
}

function saveHistory() {
    try {
        localStorage.setItem('translationHistory', JSON.stringify(state.history));
    } catch (e) {
        console.error('Failed to save history', e);
    }
}

function addHistoryItem(item) {
    state.history.unshift(item);
    if (state.history.length > 50) {
        state.history.pop();
    }
    saveHistory();
}

// --- Initialization ---
function init() {
    // Populate UI language dropdown
    uiLanguages.forEach(lang => {
        dom.uiLangSelect.add(new Option(lang.name, lang.code));
    });

    // Load preferences
    const storedUiLang = localStorage.getItem('uiLang');
    if (storedUiLang && uiLanguages.some(l => l.code === storedUiLang)) {
        state.uiLang = storedUiLang;
    }
    dom.uiLangSelect.value = state.uiLang;
    
    loadHistory();
    const storedKey = localStorage.getItem('geminiApiKey');
    if (storedKey && state.geminiService.initialize(storedKey)) {
        state.apiKeySet = true;
    }
    
    // Event listeners
    dom.apiKeyForm.addEventListener('submit', saveApiKey);
    dom.uiLangSelect.addEventListener('change', handleUiLangChange);
    dom.sourceLangSelect.addEventListener('change', e => { state.sourceLang = e.target.value; render(); });
    dom.targetLangSelect.addEventListener('change', e => { state.targetLang = e.target.value; });
    dom.swapLanguagesBtn.addEventListener('click', swapLanguages);
    dom.sourceTextarea.addEventListener('input', e => { 
        state.sourceText = e.target.value;
        render();
    });
    dom.translateBtn.addEventListener('click', handleTranslation);
    dom.spellCheckBtn.addEventListener('click', handleSpellCheck);
    dom.clearAllBtn.addEventListener('click', handleClearAll);
    dom.clearSourceBtn.addEventListener('click', handleClearSourceText);
    dom.clearTranslatedBtn.addEventListener('click', handleClearTranslatedText);

    dom.copyBtn.addEventListener('click', copyToClipboard);

    dom.toggleHistoryBtn.addEventListener('click', () => {
        state.isHistoryVisible = !state.isHistoryVisible;
        render();
    });
    dom.clearHistoryBtn.addEventListener('click', () => {
        if (confirm(t('confirmClearHistory'))) {
            state.history = [];
            saveHistory();
            render();
        }
    });
    dom.historyListContainer.addEventListener('click', handleHistoryClick);

    // Initial render
    render();
}

// Start the app
document.addEventListener('DOMContentLoaded', init);