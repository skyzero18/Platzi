import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CartService, CartItem } from '../../service/cart.service';
import { SidebarService } from '../../service/sidebar.service';
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
  cartCount = 0;
  showLogoutConfirm = false;
  showCart = false;
  cartItems: CartItem[] = [];
  totalPrice = 0;

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
      this.totalPrice = this.cartService.getTotalPrice();
    });

    this.sidebarService.showSidebar$.subscribe(show => {
      this.showCart = show;
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
