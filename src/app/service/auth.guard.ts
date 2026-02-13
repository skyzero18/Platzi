import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

// Un 'Guard' en Angular intercepta la navegación y decide si permitirla.
// Este `AuthGuard` protege rutas privadas (p. ej. /admin) verificando el
// estado de autenticación proporcionado por `AuthService`.
// Nota sobre asincronismo: aquí se usa `isLoggedIn()` que devuelve un boolean
// sincronizado basado en el estado mantenido por `AuthService` (actualizado
// por `onAuthStateChanged`). Si se necesitara una comprobación puramente
// asíncrona, el guard podría devolver una Promesa o un Observable.
export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Usuario autenticado -> permitir navegación
    return true;
  } else {
    // Usuario no autenticado -> redirigir a login y bloquear ruta protegida
    router.navigate(['/login']);
    return false;
  }
};
