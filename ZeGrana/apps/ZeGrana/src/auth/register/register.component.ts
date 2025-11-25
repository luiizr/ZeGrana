import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, InputTextModule, PasswordModule, ButtonModule, CardModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  protected title = 'ZeGrana';

  name = '';
  email = '';
  password = '';
  confirm = '';

  onSubmit(): void {
    // placeholder: integrate with auth service
    console.log('register', { name: this.name, email: this.email });
  }
}
