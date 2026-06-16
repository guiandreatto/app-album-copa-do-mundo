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
import { footballOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  template: `
    <ion-content class="login-content" [fullscreen]="true">
      <div class="login-wrapper">
        <!-- Header com logo -->
        <div class="login-header">
          <div class="logo-container">
            <ion-icon name="football-outline" class="logo-icon" aria-hidden="true"></ion-icon>
          </div>
          <h1>Sticker Tracker</h1>
          <p class="subtitle">Copa do Mundo 2022</p>
        </div>

        <!-- Card de login -->
        <div class="login-card">
          <h2>Entrar</h2>

          <div class="input-group">
            <label for="login-email">Email</label>
            <ion-input
              id="login-email"
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
            <label for="login-password">Senha</label>
            <ion-input
              id="login-password"
              type="password"
              placeholder="Sua senha"
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

          <ion-button
            expand="block"
            (click)="login()"
            [disabled]="isLoading"
            class="login-btn"
            id="btn-login"
            aria-label="Entrar"
          >
            <ion-spinner *ngIf="isLoading" name="crescent"></ion-spinner>
            <span *ngIf="!isLoading">Entrar</span>
          </ion-button>

          <div class="links">
            <ion-button fill="clear" size="small" (click)="goToRegister()" id="btn-go-register">
              Criar conta
            </ion-button>
            <ion-button fill="clear" size="small" (click)="goToResetPassword()" id="btn-go-reset">
              Esqueci minha senha
            </ion-button>
          </div>
        </div>

        <p class="footer-text">⚽ Controle suas figurinhas com facilidade</p>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .login-content {
        --background: linear-gradient(135deg, #0d1642 0%, #1a237e 40%, #1b5e20 100%);
      }

      .login-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100%;
        padding: 24px;
      }

      .login-header {
        text-align: center;
        margin-bottom: 32px;
      }

      .logo-container {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4caf50, #2e7d32);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        box-shadow: 0 8px 32px rgba(76, 175, 80, 0.4);
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      .logo-icon {
        font-size: 40px;
        color: white;
      }

      h1 {
        color: white;
        font-size: 28px;
        font-weight: 700;
        margin: 0;
        font-family: 'Inter', sans-serif;
      }

      .subtitle {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        margin: 4px 0 0;
      }

      .login-card {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 16px;
        padding: 32px 24px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
      }

      .login-card h2 {
        text-align: center;
        color: #1a237e;
        font-size: 22px;
        font-weight: 600;
        margin: 0 0 24px;
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

      .login-btn {
        margin-top: 16px;
        --border-radius: 12px;
        --background: linear-gradient(135deg, #2e7d32, #4caf50);
        height: 48px;
        font-weight: 600;
      }

      .links {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
      }

      .links ion-button {
        --color: #1a237e;
        font-size: 13px;
      }

      .footer-text {
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        margin-top: 24px;
        text-align: center;
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
export class LoginPage {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {
    addIcons({
      'football-outline': footballOutline,
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline,
    });
  }

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Preencha todos os campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/tabs/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Erro ao fazer login.';
      },
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToResetPassword(): void {
    this.router.navigate(['/reset-password']);
  }
}
