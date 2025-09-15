
export type TranslationKeys = {
  [key: string]: string | TranslationKeys;
};

export const translations: { [key: string]: TranslationKeys } = {
  en: {
    app: {
      title: "Universal Translator",
      description: "Translate any text into any language with the power of AI.",
    },
    api: {
      key: {
        label: "Your Gemini API Key",
        placeholder: "Enter your Gemini API Key here",
        save: "Save",
        saved: "API Key is set.",
        required: "Please enter and save your Gemini API Key first.",
        enable: {
            generation: "Please save your API key to enable translation."
        }
      }
    },
    translator: {
        placeholder: "Enter text...",
        translation: "Translation will appear here.",
        translateButton: "Translate",
        translatingButton: "Translating..."
    },
    language: {
        detect: "Detect Language"
    },
    "English": "English",
    "Arabic": "Arabic",
    "Kurdish (Sorani)": "Kurdish (Sorani)",
    "Kurdish (Bahdini)": "Kurdish (Bahdini)",
    "Spanish": "Spanish",
    "French": "French",
    "German": "German",
    "Japanese": "Japanese",
    "Russian": "Russian",
    "Chinese": "Chinese",
    error: {
        title: "Oops! Something went wrong."
    }
  },
  'ar-IQ': {
    app: {
      title: "المترجم العالمي",
      description: "ترجم أي نص إلى أي لغة بقوة الذكاء الاصطناعي.",
    },
     api: {
      key: {
        label: "مفتاح API الخاص بك في Gemini",
        placeholder: "أدخل مفتاح API الخاص بك في Gemini هنا",
        save: "حفظ",
        saved: "تم تعيين مفتاح API.",
        required: "الرجاء إدخال وحفظ مفتاح Gemini API الخاص بك أولاً.",
        enable: {
            generation: "الرجاء حفظ مفتاح API الخاص بك لتمكين الترجمة."
        }
      }
    },
    translator: {
        placeholder: "أدخل النص...",
        translation: "ستظهر الترجمة هنا.",
        translateButton: "ترجمة",
        translatingButton: "جاري الترجمة..."
    },
    language: {
        detect: "اكتشف اللغة"
    },
    "English": "الإنجليزية",
    "Arabic": "العربية",
    "Kurdish (Sorani)": "الكردية (السورانية)",
    "Kurdish (Bahdini)": "الكردية (البهدينية)",
    "Spanish": "الإسبانية",
    "French": "الفرنسية",
    "German": "الألمانية",
    "Japanese": "اليابانية",
    "Russian": "الروسية",
    "Chinese": "الصينية",
    error: {
        title: "عفوًا! حدث خطأ ما."
    }
  },
  'ckb-IQ': {
    app: {
      title: "وەرگێڕی گەردوونی",
      description: "هەر دەقێک بۆ هەر زمانێک وەربگێڕە بە هێزی ژیریی دەستکرد.",
    },
    api: {
      key: {
        label: "کلیلی Gemini APIی تۆ",
        placeholder: "کلیلی Gemini APIی خۆت لێرە بنووسە",
        save: "پاشەکەوتکردن",
        saved: "کلیلی API دانرا.",
        required: "تکایە سەرەتا کلیلی Gemini APIی خۆت بنووسە و پاشەکەوتی بکە.",
        enable: {
            generation: "تکایە کلیلی APIی خۆت پاشەکەوت بکە بۆ چالاککردنی وەرگێڕان."
        }
      }
    },
    translator: {
        placeholder: "دەق بنووسە...",
        translation: "وەرگێڕان لێرە دەردەکەوێت.",
        translateButton: "وەرگێڕان",
        translatingButton: "لە وەرگێڕاندایە..."
    },
    language: {
        detect: "زمان بدۆزەرەوە"
    },
    "English": "ئینگلیزی",
    "Arabic": "عەرەبی",
    "Kurdish (Sorani)": "کوردی (سۆرانی)",
    "Kurdish (Bahdini)": "کوردی (بادینی)",
    "Spanish": "ئیسپانی",
    "French": "فەرەنسی",
    "German": "ئەڵمانی",
    "Japanese": "ژاپۆنی",
    "Russian": "ڕووسی",
    "Chinese": "چینی",
    error: {
        title: "ببورە! شتێک هەڵە ڕوویدا."
    }
  },
  'kmr-IQ': {
    app: {
      title: "Wergêrê Gerdûnî",
      description: "Bi hêza AI-ê her nivîsarekê wergerîne her zimanî.",
    },
    api: {
      key: {
        label: "Mifteya te ya Gemini API",
        placeholder: "Mifteya xwe ya Gemini API li vir binivîse",
        save: "Tomar bike",
        saved: "Mifteya API hate danîn.",
        required: "Ji kerema xwe pêşî Mifteya xwe ya Gemini API binivîse û tomar bike.",
        enable: {
            generation: "Ji kerema xwe mifteya API-ya xwe tomar bikin da ku wergerandinê çalak bikin."
        }
      }
    },
    translator: {
        placeholder: "Nivîsê binivîse...",
        translation: "Werger dê li vir xuya bibe.",
        translateButton: "Wergerîne",
        translatingButton: "Tê wergerandin..."
    },
    language: {
        detect: "Ziman Tespît Bike"
    },
    "English": "Îngilîzî",
    "Arabic": "Erebî",
    "Kurdish (Sorani)": "Kurdî (Soranî)",
    "Kurdish (Bahdini)": "Kurdî (Badînî)",
    "Spanish": "Spanî",
    "French": "Fransî",
    "German": "Elmanî",
    "Japanese": "Japonî",
    "Russian": "Rûsî",
    "Chinese": "Çînî",
    error: {
        title: "Bibore! Tiştek xelet çû."
    }
  }
};
