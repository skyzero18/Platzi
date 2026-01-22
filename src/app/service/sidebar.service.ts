import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private showSidebarSubject = new BehaviorSubject<boolean>(false);
  showSidebar$ = this.showSidebarSubject.asObservable();

  constructor() { }

  setShowSidebar(show: boolean): void {
    this.showSidebarSubject.next(show);
  }

  getShowSidebar(): boolean {
    return this.showSidebarSubject.value;
  }
}