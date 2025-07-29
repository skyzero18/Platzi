import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConService } from '../../service/con1.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})

export class LoginPageComponent implements OnInit{
form: FormGroup;

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
      this.router.navigate(['/admin']);
    }
  }
  onSubmit() {
    const { email, password } = this.form.value;
    this.authService.login(email, password).then(() => {
      this.router.navigate(['/admin']);
    }).catch(error => {
      console.error('Login error:', error.message);
    });
  }
}
