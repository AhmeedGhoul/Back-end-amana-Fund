import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app.routes';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration } from '@angular/platform-browser';
// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

// perfect scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';

//Import all material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {LoaderInterceptor} from "./pages/loader/loader.interceptor";

// export function HttpLoaderFactory(http: HttpClient): any {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withComponentInputBinding()
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideClientHydration(),
    provideAnimations(), // ✅ here
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      TablerIconsModule.pick(TablerIcons),
      NgScrollbarModule,
      // TranslateModule.forRoot({
      //   loader: {
      //     provide: TranslateLoader,
      //     useFactory: HttpLoaderFactory,
      //     deps: [HttpClient],
      //   },
      // })
    ),
  ],
};
