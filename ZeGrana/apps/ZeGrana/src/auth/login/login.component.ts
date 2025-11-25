import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InputTextModule, PasswordModule, ButtonModule, CardModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  protected title = 'ZeGrana';
  email = '';
  password = '';

  onSubmit(): void {
    // placeholder: integrate with auth service
    console.log('login', { email: this.email, password: this.password });
  }
}
