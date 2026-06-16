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
import { mailOutline, lockClosedOutline, arrowBackOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  template: `
    <ion-content class="reset-content" [fullscreen]="true">
      <div class="reset-wrapper">
        <div class="reset-header">
          <div class="logo-container">
            <ion-icon name="shield-checkmark-outline" class="logo-icon" aria-hidden="true"></ion-icon>
          </div>
          <h1>Recuperar Senha</h1>
          <p class="subtitle">Informe seu email e a nova senha</p>
        </div>

        <div class="reset-card">
          <div class="input-group">
            <label for="reset-email">Email</label>
            <ion-input
              id="reset-email"
              type="email"
              placeholder="seu@email.com"
              [(ngModel)]="email"
              fill="outline"
              aria-label="Email cadastrado"
            >
              <ion-icon slot="start" name="mail-outline" aria-hidden="true"></ion-icon>
            </ion-input>
          </div>

          <div class="input-group">
            <label for="reset-new-password">Nova Senha</label>
            <ion-input
              id="reset-new-password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              [(ngModel)]="newPassword"
              fill="outline"
              aria-label="Nova senha"
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
            (click)="resetPassword()"
            [disabled]="isLoading"
            class="reset-btn"
            id="btn-reset-password"
            aria-label="Atualizar senha"
          >
            <ion-spinner *ngIf="isLoading" name="crescent"></ion-spinner>
            <span *ngIf="!isLoading">Atualizar Senha</span>
          </ion-button>

          <ion-button
            expand="block"
            fill="outline"
            (click)="goToLogin()"
            class="back-btn"
            id="btn-back-login-reset"
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
      .reset-content {
        --background: linear-gradient(135deg, #0d1642 0%, #1a237e 40%, #1b5e20 100%);
      }

      .reset-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100%;
        padding: 24px;
      }

      .reset-header {
        text-align: center;
        margin-bottom: 32px;
      }

      .logo-container {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff9800, #f57c00);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        box-shadow: 0 8px 32px rgba(255, 152, 0, 0.4);
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

      .reset-card {
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

      .error-text,
      .success-text {
        font-size: 13px;
        text-align: center;
        margin: 8px 0;
      }

      .reset-btn {
        margin-top: 16px;
        --border-radius: 12px;
        --background: linear-gradient(135deg, #f57c00, #ff9800);
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
export class ResetPasswordPage {
  email = '';
  newPassword = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {
    addIcons({
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline,
      'arrow-back-outline': arrowBackOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
    });
  }

  resetPassword(): void {
    if (!this.email || !this.newPassword) {
      this.errorMessage = 'Preencha todos os campos.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'A nova senha deve ter no mínimo 6 caracteres.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.resetPassword(this.email, this.newPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Erro ao atualizar senha.';
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
