import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CartService, CartItem } from '../../service/cart.service';
import { SidebarService } from '../../service/sidebar.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

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
  cartCount = 0;
  showLogoutConfirm = false;
  showCart = false;
  cartItems: CartItem[] = [];
  total = 0;
  isAdminRoute = false;
  isRegisterRoute = false;
  isRestrictedRoute = false;
  isLoginRoute = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private sidebarService: SidebarService,
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

    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.cartCount = this.cartService.getTotalItems();
      this.total = this.cartService.getTotalPrice();
    });

    this.sidebarService.showSidebar$.subscribe(show => {
      this.showCart = show;
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.isAdminRoute = this.router.url === '/admin';
      this.isRegisterRoute = this.router.url === '/registeruser';
      this.isLoginRoute = this.router.url === '/login';
      this.isRestrictedRoute = ['/admin', '/login', '/registeruser'].includes(this.router.url);
    });

    // Inicializar estados de ruta
    this.isAdminRoute = this.router.url === '/admin';
    this.isRegisterRoute = this.router.url === '/registeruser';
    this.isLoginRoute = this.router.url === '/login';
    this.isRestrictedRoute = ['/admin', '/login', '/registeruser'].includes(this.router.url);
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
    this.showLogoutConfirm = true;
  }

  confirmLogout() {
    this.authService.logout();
    this.showLogoutConfirm = false;
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }

  toggleCart() {
    this.sidebarService.setShowSidebar(!this.showCart);
  }

  increaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    }
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }
}
