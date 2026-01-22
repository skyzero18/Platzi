import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesKey = 'favorites';
  private favoritesSubject = new BehaviorSubject<any[]>(this.getFavorites());
  favorites$ = this.favoritesSubject.asObservable();

  constructor() { }

  private getFavorites(): any[] {
    const favorites = localStorage.getItem(this.favoritesKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  private saveFavorites(favorites: any[]): void {
    localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  addToFavorites(product: any): void {
    const favorites = this.getFavorites();
    if (!favorites.find(item => item.id === product.id)) {
      favorites.push(product);
      this.saveFavorites(favorites);
    }
  }

  removeFromFavorites(productId: string): void {
    const favorites = this.getFavorites().filter(item => item.id !== productId);
    this.saveFavorites(favorites);
  }

  isFavorite(productId: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some(item => item.id === productId);
  }

  getFavoritesList(): any[] {
    return this.getFavorites();
  }
}