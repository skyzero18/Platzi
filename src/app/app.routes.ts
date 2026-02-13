// Este archivo define las rutas de la Single Page Application (SPA).
// En una SPA la navegación entre 'páginas' no recarga el navegador; Angular
// intercambia componentes en el DOM según la ruta (enrutamiento declarativo).
// `Routes` declara qué componente se monta para cada URL.
import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';  
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginUserComponent } from './components/login-user/login-user.component';

import { AuthGuard } from './service/auth.guard'; 

export const routes: Routes = [

  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'loginuser', component: LoginUserComponent },
  { path: 'registeruser', component: RegisterComponent },
  { path: 'admin', component:  AdminPageComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '' }
    
];
