import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'platzifake2',
        appId: '1:1012187513891:web:2728828f7f9c7baf3fdd96',
        storageBucket: 'platzifake2.firebasestorage.app',
        apiKey: 'AIzaSyCtDIv2Uxn61DcwIuy5UnQAzAixBgWiUt0',
        authDomain: 'platzifake2.firebaseapp.com',
        messagingSenderId: '1012187513891',
      })
    ),

    provideFirestore(() => getFirestore()),  // ✅ separado
    provideAuth(() => getAuth()),            // ✅ separado
  ],
};