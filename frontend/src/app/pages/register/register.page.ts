import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  footballOutline,
  personOutline,
  mailOutline,
  lockClosedOutline,
  arrowBackOutline,
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  template: `
    <ion-content class="register-content" [fullscreen]="true">
      <div class="register-wrapper">
        <div class="register-header">
          <div class="logo-container">
            <ion-icon name="football-outline" class="logo-icon" aria-hidden="true"></ion-icon>
          </div>
          <h1>Criar Conta</h1>
          <p class="subtitle">Junte-se ao Sticker Tracker</p>
        </div>

        <div class="register-card">
          <div class="input-group">
            <label for="register-name">Nome</label>
            <ion-input
              id="register-name"
              type="text"
              placeholder="Seu nome completo"
              [(ngModel)]="name"
              fill="outline"
              aria-label="Nome"
            >
              <ion-icon slot="start" name="person-outline" aria-hidden="true"></ion-icon>
            </ion-input>
          </div>

          <div class="input-group">
            <label for="register-email">Email</label>
            <ion-input
              id="register-email"
              type="email"
              placeholder="seu@email.com"
              [(ngModel)]="email"
              fill="outline"
              aria-label="Email"
            >
              <ion-icon slot="start" name="mail-outline" aria-hidden="true"></ion-icon>
            </ion-input>
          </div>

          <div class="input-group">
            <label for="register-password">Senha</label>
            <ion-input
              id="register-password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              [(ngModel)]="password"
              fill="outline"
              aria-label="Senha"
            >
              <ion-icon slot="start" name="lock-closed-outline" aria-hidden="true"></ion-icon>
            </ion-input>
          </div>

          <ion-text color="danger" *ngIf="errorMessage" role="alert">
            <p class="error-text">{{ errorMessage }}</p>
          </ion-text>

          <ion-text color="success" *ngIf="successMessage" role="status">
            <p class="success-text">{{ successMessage }}</p>
          </ion-text>

          <ion-button
            expand="block"
            (click)="register()"
            [disabled]="isLoading"
            class="register-btn"
            id="btn-register"
            aria-label="Cadastrar"
          >
            <ion-spinner *ngIf="isLoading" name="crescent"></ion-spinner>
            <span *ngIf="!isLoading">Cadastrar</span>
          </ion-button>

          <ion-button
            expand="block"
            fill="outline"
            (click)="goToLogin()"
            class="back-btn"
            id="btn-back-login"
            aria-label="Voltar para login"
          >
            <ion-icon name="arrow-back-outline" slot="start" aria-hidden="true"></ion-icon>
            Voltar para Login
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .register-content {
        --background: linear-gradient(135deg, #0d1642 0%, #1a237e 40%, #1b5e20 100%);
      }

      .register-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100%;
        padding: 24px;
      }

      .register-header {
        text-align: center;
        margin-bottom: 32px;
      }

      .logo-container {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4caf50, #2e7d32);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        box-shadow: 0 8px 32px rgba(76, 175, 80, 0.4);
      }

      .logo-icon {
        font-size: 35px;
        color: white;
      }

      h1 {
        color: white;
        font-size: 26px;
        font-weight: 700;
        margin: 0;
      }

      .subtitle {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        margin: 4px 0 0;
      }

      .register-card {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 16px;
        padding: 32px 24px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
      }

      .input-group {
        margin-bottom: 16px;
      }

      .input-group label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #333;
        margin-bottom: 6px;
      }

      ion-input {
        --border-radius: 12px;
      }

      .error-text {
        font-size: 13px;
        text-align: center;
        margin: 8px 0;
      }

      .success-text {
        font-size: 13px;
        text-align: center;
        margin: 8px 0;
      }

      .register-btn {
        margin-top: 16px;
        --border-radius: 12px;
        --background: linear-gradient(135deg, #2e7d32, #4caf50);
        height: 48px;
        font-weight: 600;
      }

      .back-btn {
        margin-top: 8px;
        --border-radius: 12px;
        --border-color: #1a237e;
        --color: #1a237e;
        height: 44px;
      }
    `,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    IonText,
  ],
})
export class RegisterPage {
  name = '';
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {
    addIcons({
      'football-outline': footballOutline,
      'person-outline': personOutline,
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline,
      'arrow-back-outline': arrowBackOutline,
    });
  }

  register(): void {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Preencha todos os campos.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'A senha deve ter no mínimo 6 caracteres.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/tabs/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Erro ao criar conta.';
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
