import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { TranslateLoader, TranslationObject, provideTranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { routes } from './app.routes';
import ptTranslations from '../assets/i18n/pt.json';
import enTranslations from '../assets/i18n/en.json';

const translations: Record<string, TranslationObject> = {
  pt: ptTranslations as TranslationObject,
  en: enTranslations as TranslationObject,
};

class StaticTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    return of(translations[lang] ?? translations['pt']);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideTranslateService({
      fallbackLang: 'pt',
      loader: {
        provide: TranslateLoader,
        useClass: StaticTranslateLoader,
      },
    }),
  ],
};
