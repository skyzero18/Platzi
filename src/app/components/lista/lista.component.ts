import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConService } from '../../service/con1.service';
import { FormsModule } from '@angular/forms';

import { Api } from '../../service/api';
import { CartService } from '../../service/cart.service';
import { SidebarService } from '../../service/sidebar.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , FormsModule],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  formulario: FormGroup;
  productos: any[] = [];
  selectedProducto: any = null;
  quantity: number = 1;
  addedToCart: boolean = false;

  constructor(private conService: ConService, private api: Api, private cartService: CartService, private sidebarService: SidebarService, public authService: AuthService) {
    this.formulario = new FormGroup({
      nombre: new FormControl(),
      descripcion: new FormControl(),
      categoria: new FormControl(),
      precio: new FormControl(),
      image: new FormControl()
    });
  }

ngOnInit() {
  this.conService.getcollection().subscribe(data => {
    this.productos = data;

    // Extraer categorías únicas de los productos (locales)
    const categoriasLocales = [...new Set(data.map(p => p.categoria))]
      .filter(Boolean)
      .map(cat => cat.toLowerCase().replace(/\s+/g, '-'));




      
    // Obtener categorías desde la API externa
this.api.get<any[]>('categories').subscribe(apiCategorias => {
  this.categorias = apiCategorias.map(cat => ({
    name: cat.name,
    slug: cat.name.toLowerCase().replace(/\s+/g, '-')
  }));

  const categoriasApiSlugs = this.categorias.map(cat => cat.slug);

  const categoriasLocales = [...new Set(this.productos.map(p => p.categoria))]
    .filter(Boolean)
    .map(cat => cat.toLowerCase().replace(/\s+/g, '-'));

  const categoriasNoCoinciden = categoriasLocales.filter(local =>
    !categoriasApiSlugs.includes(local)
  );

  if (categoriasNoCoinciden.length > 0) {
    console.warn('Categorías locales que no están en la API:', categoriasNoCoinciden);
  } else {
    console.log('Todas las categorías locales están presentes en la API.');
  }
    });

    console.log('Productos cargados:', data);
  });
}


searchTerm: string = '';
selectedCategory: string = '';
categorias: { name: string, slug: string }[] = [];

get productosFiltrados() {
  return this.productos.filter(p => {
    const coincideTexto = this.searchTerm.trim().length === 0 ||
      p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());

    const categoriaSlug = p.categoria?.toLowerCase().replace(/\s+/g, '-');
    const coincideCategoria = this.selectedCategory === '' || categoriaSlug === this.selectedCategory;

    return coincideTexto && coincideCategoria;
  });
}

 onSubmit() {
  if (this.formulario.valid) {
    const producto = this.formulario.value; // ya es del tipo Producto

    console.log('Formulario enviado:', producto);

    this.conService.postCollection(producto).then(() => {
      console.log('Producto agregado correctamente');
      // Podés resetear el formulario si querés:
      this.formulario.reset();
    }).catch(error => {
      console.error('Error al agregar producto:', error);
    });
  } else {
    console.warn('Formulario inválido');
  }  }
  selectProducto(producto: any) {
    this.selectedProducto = producto;
    this.quantity = 1;
    this.addedToCart = false;
    // Cerrar sidebar si está abierto
    if (this.sidebarService.getShowSidebar()) {
      this.sidebarService.setShowSidebar(false);
    }
  }

  addToCart(producto: any) {
    if (this.authService.isLoggedIn()) {
      this.cartService.addToCart(producto, this.quantity);
      this.addedToCart = true;
      setTimeout(() => {
        this.selectedProducto = null;
        this.addedToCart = false;
      }, 1500);
    }
  }
}
