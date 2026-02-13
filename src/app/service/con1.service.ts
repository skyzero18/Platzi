import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, updateDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { Producto } from './interface';
import { Observable } from 'rxjs';  

@Injectable({
  providedIn: 'root'
})


export class ConService {
  // Inyección del servicio Firestore proporcionado por AngularFire.
  // Firestore es una base de datos NoSQL en la nube; aquí manipulamos
  // la colección "productos" usando las funciones modulares de @angular/fire.
  constructor(private firestore: Firestore ) { }

  // Operación Create (C de CRUD)
  // - `addDoc` persiste un nuevo documento en la colección "productos".
  // - Devuelve una Promesa que se resuelve cuando la operación remota finaliza.
  // - Uso de Asincronismo: llamando a `postCollection(...).then(...)` podemos
  //   encadenar lógica una vez que Firestore confirme la escritura.
  postCollection(producto: Producto) {
    const col = collection(this.firestore, "productos");
    return addDoc(col, producto);
  }

  // Operación Read (R de CRUD)
  // - `collectionData` devuelve un Observable que emite los documentos
  //   actuales y posteriores de la colección. Esto es reactivo (RxJS),
  //   útil para actualizar la UI automáticamente cuando los datos cambien.
  // - No es una Promesa sino un Observable: representa un flujo continuo
  //   en lugar de una única respuesta asíncrona.
  getcollection(): Observable<Producto[]> {
    const col = collection(this.firestore, "productos");
    return collectionData(col, { idField: 'id' }) as Observable<Producto[]>
  }

  // Operación Delete (D de CRUD)
  // - `deleteDoc` recibe una referencia a un documento y retorna una Promesa.
  // - Al resolverse, el documento se ha eliminado en Firestore.
  deleteCollection(id: string) {
    const docRef = doc(this.firestore, "productos", id);
    return deleteDoc(docRef);
  }

  // Operación Update (U de CRUD)
  // - `updateDoc` actualiza campos específicos del documento referenciado.
  // - Recibe un objeto parcial `Partial<Producto>` para no sobreescribir todo.
  // - También devuelve una Promesa: maneja asincronismo con `.then/.catch`.
  updateCollection(id: string, producto: Partial<Producto>) {
    const docRef = doc(this.firestore, "productos", id);
    return updateDoc(docRef, producto);
  }
}
