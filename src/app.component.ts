
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeminiService } from './services/gemini.service';

interface Language {
  code: string;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CommonModule],
})
export class AppComponent {
  private readonly geminiService = inject(GeminiService);

  languages: Language[] = [
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

  sourceLang = signal<string>('en');
  targetLang = signal<string>('ar-IQ');
  sourceText = signal<string>('');
  translatedText = signal<string>('');
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  async handleTranslation(): Promise<void> {
    const text = this.sourceText();
    if (!text.trim()) {
      this.translatedText.set('');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.translatedText.set('');

    try {
      const sourceLangName = this.languages.find(l => l.code === this.sourceLang())?.name || 'English';
      const targetLangName = this.languages.find(l => l.code === this.targetLang())?.name || 'Arabic (Iraqi dialect)';
      
      const result = await this.geminiService.translateText(text, sourceLangName, targetLangName);
      this.translatedText.set(result);
    } catch (e) {
      this.error.set('حدث خطأ أثناء الترجمة. يرجى المحاولة مرة أخرى.');
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  swapLanguages(): void {
    const currentSource = this.sourceLang();
    const currentTarget = this.targetLang();
    this.sourceLang.set(currentTarget);
    this.targetLang.set(currentSource);

    const currentSourceText = this.sourceText();
    const currentTranslatedText = this.translatedText();
    this.sourceText.set(currentTranslatedText);
    this.translatedText.set(currentSourceText);
  }
}
