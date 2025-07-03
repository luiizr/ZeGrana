import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  imports: [TextareaModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // protected title = 'ZeGrana';
  value = 'amazon';
}
