import { Component } from '@angular/core';
import { ListaComponent } from '../lista/lista.component';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-home-page',
  imports: [ ListaComponent ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
