import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { updateProfile } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registroForm: FormGroup;
  showModal = false;
  modalMessage = '';
  hidePassword = true;

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
    // Validador personalizado del correo electrónico.
    // Regex explicado:
    // - `^[a-zA-Z0-9._%+-]+@gmail\.com$`:
    //    ^  => ancla de inicio de cadena
    //    [a-zA-Z0-9._%+-]+ => uno o más caracteres válidos en la parte local
    //    @gmail\.com => dominio exactamente "gmail.com" (el punto está escapado)
    //    $  => ancla de fin de cadena (garantiza que no haya texto adicional)
    // El símbolo `$` al final es crítico: obliga a que la cadena termine en
    // `@gmail.com`, evitando coincidencias parciales como "user@gmail.com.evil".
    // Esto mejora la integridad antes de enviar datos a Firebase Authentication,
    // reduciendo entradas inválidas en la base de usuarios.
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return { invalidEmail: true };
    }

    // Rechaza caracteres con acentos, ñ o comas para evitar problemas de normalización
    // y entradas inválidas que Firebase podría rechazar o almacenar de forma inesperada.
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
        if (error.code === 'auth/invalid-email') {
          this.modalMessage = 'El formato del correo es incorrecto (debe ser .com u otro dominio válido)';
        } else if (error.code === 'auth/email-already-in-use') {
          this.modalMessage = 'Este correo ya está registrado';
        } else {
          this.modalMessage = 'Error al registrar usuario: ' + error.message;
        }
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

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
