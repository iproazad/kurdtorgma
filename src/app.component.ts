import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from './services/translation.service';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';

interface Language {
  name: string;
  flag: string;
  nativeName: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LanguageSelectorComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TranslationService],
})
export class AppComponent {
  private translationService = inject(TranslationService);

  // State Signals
  sourceText = signal('');
  translatedText = signal('');
  sourceLang = signal('English');
  targetLang = signal('Arabic (Iraqi Dialect)');
  isLoading = signal(false);
  error = signal<string | null>(null);
  isCopied = signal(false);
  isOnline = signal(navigator.onLine);
  isFromCache = signal(false);
  
  // Language Detection Signals
  detectedLang = signal<string | null>(null);
  isDetectingLang = signal(false);
  private detectionTimeout: any;


  // Language list for suggestions
  languages: Language[] = [
    { name: 'English', flag: '🇬🇧', nativeName: 'English' },
    { name: 'Arabic (Standard)', flag: '🇸🇦', nativeName: 'العربية (الفصحى)' },
    { name: 'Arabic (Iraqi Dialect)', flag: '🇮🇶', nativeName: 'العربية (اللهجة العراقية)' },
    { name: 'Arabic (Egyptian Dialect)', flag: '🇪🇬', nativeName: 'العربية (اللهجة المصرية)' },
    { name: 'Kurdish (Sorani)', flag: '🇮🇶', nativeName: 'کوردی (سۆرانی)' },
    { name: 'Kurdish (Kurmanji)', flag: '🇹🇷', nativeName: 'Kurdî (Kurmancî)' },
    { name: 'Kurdish (Badini)', flag: '🇮🇶', nativeName: 'کوردی (بادینی)' },
    { name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
    { name: 'French', flag: '🇫🇷', nativeName: 'Français' },
    { name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
    { name: 'Chinese (Mandarin)', flag: '🇨🇳', nativeName: '中文 (普通话)' },
    { name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
    { name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
    { name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
    { name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
    { name: 'Bengali', flag: '🇧🇩', nativeName: 'বাংলা' },
    { name: 'Urdu', flag: '🇵🇰', nativeName: 'اردو' },
    { name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
    { name: 'Persian (Farsi)', flag: '🇮🇷', nativeName: 'فارسی' },
  ];

  sourceLangObject = computed(() => this.languages.find(l => l.name === this.sourceLang()));
  targetLangObject = computed(() => this.languages.find(l => l.name === this.targetLang()));

  constructor() {
    window.addEventListener('online', () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));
  }

  // Computed signal for character count
  charCount = computed(() => this.sourceText().length);
  readonly maxChars = 5000;

  // --- Caching Logic ---
  private getCacheKey(text: string, source: string, target: string): string {
    return `gemini_translator_cache::${source}::${target}::${text.trim()}`;
  }

  private saveToCache(key: string, translation: string): void {
    try {
      localStorage.setItem(key, translation);
    } catch (e) {
      console.error('Failed to save translation to localStorage:', e);
    }
  }

  private getFromCache(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
      return null;
    }
  }

  // --- Event Handlers ---
  onSourceTextChange(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.sourceText.set(value);
    this.translatedText.set('');
    this.error.set(null);
    this.isFromCache.set(false);
    this.detectedLang.set(null);

    // Debounce language detection
    clearTimeout(this.detectionTimeout);
    if (value.trim().length > 10) { // Only detect if there's enough text
      this.detectionTimeout = setTimeout(() => {
        this.handleLanguageDetection();
      }, 500); // 500ms delay after user stops typing
    }
  }
  
  onSourceLangChange(languageName: string): void {
    this.sourceLang.set(languageName);
    this.translatedText.set('');
    this.error.set(null);
    this.isFromCache.set(false);
    this.detectedLang.set(null); // User took manual control, hide detection result
  }

  onTargetLangChange(languageName: string): void {
    this.targetLang.set(languageName);
    this.translatedText.set('');
    this.error.set(null);
    this.isFromCache.set(false);
  }

  async handleLanguageDetection(): Promise<void> {
    const source = this.sourceText().trim();
    if (!source || this.isDetectingLang()) return;

    this.isDetectingLang.set(true);
    try {
      const detected = await this.translationService.detectLanguage(source);
      if (detected) {
        this.detectedLang.set(detected);
        // Pre-select the detected language if it's in our known list
        if (this.languages.map(l => l.name.toLowerCase()).includes(detected.toLowerCase())) {
          // Find the correct capitalization from our list
          const matchingLang = this.languages.find(l => l.name.toLowerCase() === detected.toLowerCase());
          if(matchingLang) this.sourceLang.set(matchingLang.name);
        }
      }
    } catch (e) {
      console.error("Language detection failed", e);
      this.detectedLang.set(null); // Fail gracefully
    } finally {
      this.isDetectingLang.set(false);
    }
  }

  async handleTranslation(): Promise<void> {
    const source = this.sourceText().trim();
    if (!source || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.translatedText.set('');
    this.isFromCache.set(false);

    const cacheKey = this.getCacheKey(source, this.sourceLang(), this.targetLang());

    if (this.isOnline()) {
      try {
        const result = await this.translationService.translateText(
          source,
          this.sourceLang(),
          this.targetLang()
        );
        this.translatedText.set(result);
        if (result) {
          this.saveToCache(cacheKey, result);
        }
      } catch (e) {
        this.error.set(e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.');
        console.error(e);
      } finally {
        this.isLoading.set(false);
      }
    } else { // Offline logic
      const cachedResult = this.getFromCache(cacheKey);
      if (cachedResult) {
        this.translatedText.set(cachedResult);
        this.isFromCache.set(true);
      } else {
        this.error.set('You are offline and this translation is not cached.');
      }
      this.isLoading.set(false);
    }
  }

  swapLanguages(): void {
    const currentSource = this.sourceLang();
    this.sourceLang.set(this.targetLang());
    this.targetLang.set(currentSource);

    // Move translated text to source text area for re-translation
    if (this.translatedText()) {
      this.sourceText.set(this.translatedText());
      this.translatedText.set('');
    }

    this.isFromCache.set(false);
    this.error.set(null);
    this.detectedLang.set(null);
    clearTimeout(this.detectionTimeout);
  }

  clearInput(): void {
    this.sourceText.set('');
    this.translatedText.set('');
    this.error.set(null);
    this.isFromCache.set(false);
    this.detectedLang.set(null);
    clearTimeout(this.detectionTimeout);
  }

  copyToClipboard(): void {
    if (!this.translatedText()) {
      return;
    }
    navigator.clipboard.writeText(this.translatedText()).then(() => {
      this.isCopied.set(true);
      setTimeout(() => this.isCopied.set(false), 2000);
    });
  }
}