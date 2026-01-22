import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any = null;
  showModal = false;
  loginForm: FormGroup;
  showSuccessModal = false;
  modalMessage = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: '',
      password: ''
    });
  }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onLoginSubmit() {
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).then(() => {
      this.modalMessage = 'Inicio de sesión exitosa';
      this.showSuccessModal = true;
      this.closeModal();
    }).catch(error => {
      this.modalMessage = 'Contraseña o correo incorrectos';
      this.showSuccessModal = true;
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    if (this.modalMessage === 'Inicio de sesión exitosa') {
      this.router.navigate(['/']);
    }
  }

  logout() {
    this.authService.logout();
  }
}
