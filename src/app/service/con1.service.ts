import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, updateDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { Producto } from './interface';
import { Observable } from 'rxjs';  

@Injectable({
  providedIn: 'root'
})


export class ConService {

  constructor(private firestore: Firestore ) { }

  postCollection(producto: Producto) {
    const col = collection(this.firestore, "productos");
    return addDoc(col, producto);
  }


  getcollection(): Observable<Producto[]> {
    const col = collection(this.firestore, "productos");
    return collectionData(col, { idField: 'id' }) as Observable<Producto[]>
  }

  deleteCollection(id: string) {
    const docRef = doc(this.firestore, "productos", id);
    return deleteDoc(docRef);
  }

  updateCollection(id: string, producto: Partial<Producto>) {
    const docRef = doc(this.firestore, "productos", id);
    return updateDoc(docRef, producto);
  }
}
