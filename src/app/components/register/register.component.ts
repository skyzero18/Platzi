import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { updateProfile } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registroForm: FormGroup;
  showModal = false;
  modalMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    // No redirigir si ya hay sesión, permitir registro
  }

  emailValidator(control: any) {
    const email = control.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return { invalidEmail: true };
    }
    // No permitir comas, acentos, caracteres especiales
    const invalidChars = /[áéíóúÁÉÍÓÚñÑ,]/;
    if (invalidChars.test(email)) {
      return { invalidChars: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const { nombre, email, password } = this.registroForm.value;
      this.authService.createUser(email, password).then(userCredential => {
        updateProfile(userCredential.user, { displayName: nombre }).then(() => {
          this.modalMessage = 'Usuario registrado con éxito';
          this.showModal = true;
        }).catch(error => {
          this.modalMessage = 'Error al actualizar perfil';
          this.showModal = true;
        });
      }).catch(error => {
        this.modalMessage = 'Error al registrar usuario';
        this.showModal = true;
      });
    } else {
      this.modalMessage = 'Contraseña o gmail no validos';
      this.showModal = true;
    }
  }

  closeModal() {
    this.showModal = false;
    if (this.modalMessage === 'Usuario registrado con éxito') {
      this.router.navigate(['/loginuser']);
    }
  }
}
