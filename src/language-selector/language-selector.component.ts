import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// In a larger app, this would be in a shared 'types' or 'interfaces' file.
interface Language {
  name: string;
  flag: string;
  nativeName: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onClickOutside($event)',
  }
})
export class LanguageSelectorComponent {
  private elementRef = inject(ElementRef);

  // Inputs & Outputs
  languages = input.required<Language[]>();
  selectedLanguageName = input.required<string>();
  placeholder = input<string>('');
  listId = input.required<string>();
  ariaLabel = input<string>('Select Language');
  focusRingColor = input<string>('focus:ring-sky-500');

  languageChange = output<string>();

  // Internal State
  isOpen = signal(false);
  searchTerm = signal('');
  
  // Computed values
  selectedLanguage = computed(() => this.languages().find(l => l.name === this.selectedLanguageName()));

  filteredLanguages = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.languages();
    }
    return this.languages().filter(lang => 
      lang.name.toLowerCase().includes(term) || 
      lang.nativeName.toLowerCase().includes(term)
    );
  });

  // Event Handlers
  toggleDropdown(): void {
    this.isOpen.update(open => !open);
    if (!this.isOpen()) {
        this.searchTerm.set(''); // Reset search on close
    }
  }

  selectLanguage(languageName: string): void {
    if (this.selectedLanguageName() !== languageName) {
        this.languageChange.emit(languageName);
    }
    this.isOpen.set(false);
    this.searchTerm.set(''); // Reset search on selection
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  // Close dropdown if clicked outside the component
  onClickOutside(event: MouseEvent): void {
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.searchTerm.set('');
    }
  }
}
