import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-user',
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.css'
})

export class LoginUserComponent implements OnInit{
form: FormGroup;
showModal: boolean = false;
modalMessage: string = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: '',
      password: ''
    });
  }
  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }
  onSubmit() {
    const { email, password } = this.form.value;
    this.authService.login(email, password).then(() => {
      this.modalMessage = 'Inicio de sesión exitosa';
      this.showModal = true;
    }).catch(error => {
      this.modalMessage = 'Contraseña o correo incorrectos';
      this.showModal = true;
      console.error('Login error:', error.message);
    });
  }
  closeModal() {
    this.showModal = false;
    if (this.modalMessage === 'Inicio de sesión exitosa') {
      this.router.navigate(['/']);
    }
  }
}
