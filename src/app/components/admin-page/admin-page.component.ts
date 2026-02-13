import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConService } from '../../service/con1.service';
import { AuthService } from '../../service/auth.service';
import { Api } from '../../service/api';
@Component({
  selector: 'app-admin-page',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit {

  // Formulario reactivo que contiene los campos del producto.
  // Los Formularios Reactivos (Reactive Forms) dan control explícito
  // sobre el estado, validación y valores, y permiten programar lógica
  // de negocio desde el componente.
  formulario: FormGroup;
  productos: any[] = [];
  categorias: string[] = [];
  editId: string | null = null; // id del producto en edición (null => crear)
  isLoading: boolean = false;

  // Formulario específico para crear usuarios desde el panel (solo ejemplo)
  usuarioForm: FormGroup;

  // Inyección de Dependencias en el constructor:
  // - `ConService` provee las operaciones CRUD contra Firestore.
  // - `AuthService` permite gestionar usuarios (Firebase Auth).
  // - `Api` es un cliente para obtener recursos externos (categorías).
  // La Inyección de Dependencias favorece la separación de responsabilidades
  // y facilita pruebas unitarias.
  constructor(private conService: ConService, private authservice: AuthService, private api: Api) {
    this.formulario = new FormGroup({
      nombre: new FormControl(),
      descripcion: new FormControl(),
      categoria: new FormControl(),
      precio: new FormControl(),
      image: new FormControl()
    });

    this.usuarioForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });

  }

  ngOnInit() {
    // Suscribimos al Observable de `getcollection()` para recibir datos
    // reactivos desde Firestore. Esto demuestra Asincronismo y uso de RxJS:
    // cada vez que la colección cambie, `productos` se actualiza.
    this.conService.getcollection().subscribe(data => {
      this.productos = data;
      console.log('Productos cargados:', data);
    });

    // Obtener categorías desde la API externa (ejemplo de integración HTTP)
    // También es una operación asíncrona que devuelve un Observable.
    this.api.get<any[]>('categories').subscribe(data => {
      this.categorias = data.map(cat => cat.name);
      console.log('Categorías desde API:', this.categorias);
    });
  }

   onSubmit() {
    if (this.formulario.valid) {
      this.isLoading = true;
      const producto = this.formulario.value;

      // Lógica del método onSubmit / onEdit:
      // - Si `editId` está definido => estamos en modo edición (UPDATE).
      // - Si `editId` es null => estamos en modo creación (CREATE).
      // Esto es la base de la lógica de negocio de la SPA: un único formulario
      // que sirve para crear y actualizar recursos según el estado.
      if (this.editId) {
        this.conService.updateCollection(this.editId, producto)
          .then(() => {
            console.log('Producto actualizado correctamente');
            alert('¡Producto actualizado con éxito!');
            this.formulario.reset();
            this.editId = null;
            this.isLoading = false;
          })
          .catch(error => {
            console.error('Error al actualizar producto:', error);
            this.isLoading = false;
          });
      } else {
        this.conService.postCollection(producto)
          .then(() => {
            console.log('Producto agregado correctamente');
            alert('¡Producto agregado con éxito!');
            this.formulario.reset();
            this.isLoading = false;
          })
          .catch(error => {
            console.error('Error al agregar producto:', error);
            this.isLoading = false;
          });
      }
    } else {
      console.warn('Formulario inválido');
    }
  }

  // onEdit prepara el formulario para edición:
  // - Rellena los controles con los valores del producto seleccionado.
  // - Establece `editId` para que onSubmit sepa que debe actualizar
  //   en lugar de crear. Es un patrón simple y claro para distinguir
  //   entre CREATE y UPDATE en la UI.
  onEdit(producto: any) {
    this.editId = producto.id;
    this.formulario.setValue({
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      categoria: producto.categoria || '',
      precio: producto.precio || 0,
      image: producto.image || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.conService.deleteCollection(id)
        .then(() => console.log('Producto eliminado correctamente'))
        .catch(error => console.error('Error al eliminar producto:', error));
    }
  }

    onCreateUser() {
    const { email, password } = this.usuarioForm.value;
    if (email && password) {
      this.authservice.createUser(email, password)
        .then(() => {
          console.log('Usuario creado correctamente');
          this.usuarioForm.reset();
        })
        .catch(error => {
          console.error('Error al crear usuario:', error.message);
        });
    } else {
      console.warn('Datos de usuario incompletos');
    }
  }
}

