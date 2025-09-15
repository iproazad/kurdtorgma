import '@angular/compiler'; // JIT compilation
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

import { AppComponent } from './src/app.component.ts';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient()
  ],
}).catch((err) => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.