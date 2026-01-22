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

  formulario: FormGroup;
  productos: any[] = [];
  categorias: string[] = [];
  editId: string | null = null;
  isLoading: boolean = false;

  usuarioForm: FormGroup;

  constructor(private conService: ConService, private authservice: AuthService, private api: Api) {
    this.formulario = new FormGroup({
      nombre: new FormControl(),
      descripcion: new FormControl(),
      categoria: new FormControl(),
      precio: new FormControl(),
      image: new FormControl()
    });

  this.usuarioForm = new FormGroup({ // ✅ AGREGADO
    email: new FormControl(),
    password: new FormControl()
  });

  }

  ngOnInit() {
    this.conService.getcollection().subscribe(data => {
      this.productos = data;
      console.log('Productos cargados:', data);
    });

    // Obtener categorías desde la API externa
    this.api.get<any[]>('categories').subscribe(data => {
      this.categorias = data.map(cat => cat.name);
      console.log('Categorías desde API:', this.categorias);
    });
  }

   onSubmit() {
    if (this.formulario.valid) {
      this.isLoading = true;
      const producto = this.formulario.value;

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

