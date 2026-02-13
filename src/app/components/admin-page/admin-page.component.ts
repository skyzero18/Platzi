import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs'; // Librería RxJS para manejar flujos de datos (Observables)
import { ConService } from '../../service/con1.service';
import { AuthService } from '../../service/auth.service';
import { Api } from '../../service/api';

/**
 * INTERFACE: Define la estructura de los datos del producto.
 * Esto asegura el "Tipado Fuerte" en TypeScript, evitando errores de lógica en el desarrollo.
 */
interface Producto {
  id?: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  image: string;
}

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
/**
 * Implementamos OnInit para la carga inicial y OnDestroy para la limpieza de memoria.
 */
export class AdminPageComponent implements OnInit, OnDestroy {

  formulario: FormGroup;
  productos: Producto[] = []; 
  categorias: string[] = [];
  editId: string | null = null; // Estado para diferenciar entre CREAR y EDITAR
  isLoading: boolean = false; // Flag para feedback visual de carga
  usuarioForm: FormGroup;

  // SUBSCRIPTION: Centraliza nuestras suscripciones para manejarlas profesionalmente.
  private subs = new Subscription();

  constructor(
    private conService: ConService, 
    private authservice: AuthService, 
    private api: Api
  ) {
    /**
     * FORMULARIOS REACTIVOS: Controlamos la validación en el lado del cliente.
     * Esto evita enviar datos nulos o incorrectos a Firebase.
     */
    this.formulario = new FormGroup({
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      categoria: new FormControl('', Validators.required),
      precio: new FormControl(0, [Validators.required, Validators.min(1)]),
      image: new FormControl('', Validators.required)
    });

    this.usuarioForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  /**
   * ngOnInit: Se activa al cargar el componente. 
   * Es el punto donde conectamos los flujos de datos (Observables) de forma ASÍNCRONA.
   */
  ngOnInit() {
    // Escuchamos cambios en tiempo real desde Firestore (Base de Datos NoSQL)
    this.subs.add(
      this.conService.getcollection().subscribe(data => {
        this.productos = data as Producto[];
        console.log('Suscripción activa: El DOM se actualizará automáticamente ante cambios');
      })
    );

    // Consumimos categorías desde una API REST externa
    this.subs.add(
      this.api.get<any[]>('categories').subscribe(data => {
        this.categorias = data.map(cat => cat.name);
      })
    );
  }

  /**
   * ngOnDestroy: Fundamental en una SPA. 
   * Cerramos los "grifos" de datos para evitar Memory Leaks (fugas de memoria).
   */
  ngOnDestroy() {
    this.subs.unsubscribe(); 
    console.log('Memoria liberada y flujo de datos cerrado correctamente');
  }

  /**
   * onSubmit: Gestiona la creación o actualización de documentos.
   * Utiliza PROMESAS (.then) para manejar la respuesta única del servidor.
   */
  onSubmit() {
    if (this.formulario.valid) {
      this.isLoading = true;
      const producto = this.formulario.value;

      if (this.editId) {
        // Lógica de UPDATE (Actualización de recurso existente)
        this.conService.updateCollection(this.editId, producto)
          .then(() => {
            alert('Producto actualizado con éxito');
            this.limpiarFormulario();
          })
          .catch(err => {
            console.error(err);
            this.isLoading = false;
          });
      } else {
        // Lógica de CREATE (Creación de nuevo recurso)
        this.conService.postCollection(producto)
          .then(() => {
            alert('Producto creado con éxito');
            this.limpiarFormulario();
          })
          .catch(err => {
            console.error(err);
            this.isLoading = false;
          });
      }
    }
  }

  limpiarFormulario() {
    this.formulario.reset();
    this.editId = null;
    this.isLoading = false;
  }

  /**
   * onEdit: Carga los datos del objeto seleccionado en el formulario.
   * Facilita la experiencia de usuario (UX) mediante Data Binding.
   */
  onEdit(producto: Producto) {
    this.editId = producto.id || null;
    this.formulario.patchValue(producto);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * onDelete: Elimina un nodo de la colección de Firestore.
   * Se ajustó para aceptar 'string | undefined' y evitar errores de tipado.
   */
  onDelete(id: string | undefined) {
    if (id && confirm('¿Seguro que deseas eliminar este producto?')) {
      this.conService.deleteCollection(id)
        .then(() => console.log('Documento eliminado. El Observable actualizará la vista.'));
    }
  }

  onCreateUser() {
    const { email, password } = this.usuarioForm.value;
    if (this.usuarioForm.valid) {
      this.authservice.createUser(email, password)
        .then(() => {
          alert('Administrador creado en Firebase Auth');
          this.usuarioForm.reset();
        });
    }
  }
}