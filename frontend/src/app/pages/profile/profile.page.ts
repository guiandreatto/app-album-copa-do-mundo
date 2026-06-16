import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonSpinner,
  IonButton,
  IonInput,
  IonText,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  calendarOutline,
  createOutline,
  lockClosedOutline,
  logOutOutline,
  checkmarkOutline,
  closeOutline,
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { User } from '../../interfaces/models';

@Component({
  selector: 'app-profile',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-title>
          <ion-icon name="person-outline" aria-hidden="true"></ion-icon>
          Meu Perfil
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="profile-content">
      <div *ngIf="isLoading" class="loading-container">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
      </div>

      <div *ngIf="!isLoading && user" class="profile-wrapper">
        <!-- Avatar e info principal -->
        <div class="profile-hero">
          <div class="avatar">
            <span>{{ getInitials() }}</span>
          </div>
          <h2>{{ user.name }}</h2>
          <p class="user-email">{{ user.email }}</p>
        </div>

        <!-- Informações do perfil -->
        <div class="info-card">
          <h3>Informações</h3>

          <div class="info-row">
            <ion-icon name="person-outline" aria-hidden="true"></ion-icon>
            <div class="info-data">
              <span class="info-label">Nome</span>
              <span class="info-value">{{ user.name }}</span>
            </div>
          </div>

          <div class="info-row">
            <ion-icon name="mail-outline" aria-hidden="true"></ion-icon>
            <div class="info-data">
              <span class="info-label">Email</span>
              <span class="info-value">{{ user.email }}</span>
            </div>
          </div>

          <div class="info-row">
            <ion-icon name="calendar-outline" aria-hidden="true"></ion-icon>
            <div class="info-data">
              <span class="info-label">Membro desde</span>
              <span class="info-value">{{ formatDate(user.created_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Editar nome -->
        <div class="edit-card">
          <h3>
            <ion-icon name="create-outline" aria-hidden="true"></ion-icon>
            Editar Nome
          </h3>

          <div class="input-group">
            <label for="edit-name">Novo nome</label>
            <ion-input
              id="edit-name"
              type="text"
              placeholder="Seu novo nome"
              [(ngModel)]="newName"
              fill="outline"
              aria-label="Novo nome"
            ></ion-input>
          </div>

          <ion-text color="success" *ngIf="nameSuccess" role="status">
            <p class="msg-text">{{ nameSuccess }}</p>
          </ion-text>
          <ion-text color="danger" *ngIf="nameError" role="alert">
            <p class="msg-text">{{ nameError }}</p>
          </ion-text>

          <ion-button
            expand="block"
            (click)="updateName()"
            [disabled]="isUpdatingName"
            class="save-btn"
            id="btn-update-name"
          >
            <ion-spinner *ngIf="isUpdatingName" name="crescent"></ion-spinner>
            <span *ngIf="!isUpdatingName">
              <ion-icon name="checkmark-outline" aria-hidden="true"></ion-icon>
              Salvar Nome
            </span>
          </ion-button>
        </div>

        <!-- Alterar senha -->
        <div class="edit-card">
          <h3>
            <ion-icon name="lock-closed-outline" aria-hidden="true"></ion-icon>
            Alterar Senha
          </h3>

          <div class="input-group">
            <label for="current-password">Senha atual</label>
            <ion-input
              id="current-password"
              type="password"
              placeholder="Sua senha atual"
              [(ngModel)]="currentPassword"
              fill="outline"
              aria-label="Senha atual"
            ></ion-input>
          </div>

          <div class="input-group">
            <label for="new-password-profile">Nova senha</label>
            <ion-input
              id="new-password-profile"
              type="password"
              placeholder="Mínimo 6 caracteres"
              [(ngModel)]="newPassword"
              fill="outline"
              aria-label="Nova senha"
            ></ion-input>
          </div>

          <ion-text color="success" *ngIf="passwordSuccess" role="status">
            <p class="msg-text">{{ passwordSuccess }}</p>
          </ion-text>
          <ion-text color="danger" *ngIf="passwordError" role="alert">
            <p class="msg-text">{{ passwordError }}</p>
          </ion-text>

          <ion-button
            expand="block"
            (click)="changePassword()"
            [disabled]="isChangingPassword"
            class="save-btn"
            id="btn-change-password"
          >
            <ion-spinner *ngIf="isChangingPassword" name="crescent"></ion-spinner>
            <span *ngIf="!isChangingPassword">
              <ion-icon name="checkmark-outline" aria-hidden="true"></ion-icon>
              Alterar Senha
            </span>
          </ion-button>
        </div>

        <!-- Logout -->
        <ion-button
          expand="block"
          fill="outline"
          color="danger"
          (click)="logout()"
          class="logout-btn"
          id="btn-logout"
          aria-label="Sair da conta"
        >
          <ion-icon name="log-out-outline" slot="start" aria-hidden="true"></ion-icon>
          Sair da Conta
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [
    `
      ion-toolbar {
        --background: linear-gradient(135deg, #1a237e, #2e7d32);
        --color: white;
      }

      ion-title ion-icon {
        margin-right: 8px;
        vertical-align: middle;
      }

      .profile-content {
        --background: #f0f2f5;
      }

      .loading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50vh;
      }

      .profile-wrapper {
        padding: 16px;
        padding-bottom: 100px;
      }

      /* Hero section */
      .profile-hero {
        text-align: center;
        padding: 24px 0;
      }

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, #1a237e, #2e7d32);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;
        box-shadow: 0 8px 24px rgba(26, 35, 126, 0.3);
      }

      .avatar span {
        color: white;
        font-size: 28px;
        font-weight: 700;
      }

      .profile-hero h2 {
        color: #212121;
        font-size: 22px;
        font-weight: 600;
        margin: 0;
      }

      .user-email {
        color: #757575;
        font-size: 14px;
        margin: 4px 0 0;
      }

      /* Info card */
      .info-card,
      .edit-card {
        background: white;
        border-radius: 14px;
        padding: 20px;
        margin-bottom: 16px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      }

      .info-card h3,
      .edit-card h3 {
        color: #1a237e;
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 16px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .info-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
      }

      .info-row:last-child {
        border-bottom: none;
      }

      .info-row ion-icon {
        font-size: 20px;
        color: #2e7d32;
        min-width: 20px;
      }

      .info-data {
        display: flex;
        flex-direction: column;
      }

      .info-label {
        font-size: 11px;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .info-value {
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }

      /* Edit sections */
      .input-group {
        margin-bottom: 12px;
      }

      .input-group label {
        display: block;
        font-size: 13px;
        font-weight: 500;
        color: #333;
        margin-bottom: 6px;
      }

      ion-input {
        --border-radius: 12px;
      }

      .msg-text {
        font-size: 13px;
        text-align: center;
        margin: 8px 0;
      }

      .save-btn {
        --border-radius: 12px;
        --background: linear-gradient(135deg, #2e7d32, #4caf50);
        height: 44px;
        font-weight: 600;
        margin-top: 8px;
      }

      .save-btn ion-icon {
        margin-right: 4px;
      }

      .logout-btn {
        --border-radius: 12px;
        height: 48px;
        font-weight: 600;
        margin-top: 8px;
      }
    `,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonSpinner,
    IonButton,
    IonInput,
    IonText,
    IonItem,
    IonLabel,
  ],
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  isLoading = true;

  newName = '';
  isUpdatingName = false;
  nameSuccess = '';
  nameError = '';

  currentPassword = '';
  newPassword = '';
  isChangingPassword = false;
  passwordSuccess = '';
  passwordError = '';

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {
    addIcons({
      'person-outline': personOutline,
      'mail-outline': mailOutline,
      'calendar-outline': calendarOutline,
      'create-outline': createOutline,
      'lock-closed-outline': lockClosedOutline,
      'log-out-outline': logOutOutline,
      'checkmark-outline': checkmarkOutline,
      'close-outline': closeOutline,
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  ionViewWillEnter(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.apiService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.newName = user.name;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  getInitials(): string {
    if (!this.user) return '';
    return this.user.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  updateName(): void {
    if (!this.newName.trim()) {
      this.nameError = 'Nome é obrigatório.';
      return;
    }

    this.isUpdatingName = true;
    this.nameError = '';
    this.nameSuccess = '';

    this.apiService.updateProfile(this.newName).subscribe({
      next: (user) => {
        this.user = user;
        this.authService.updateCurrentUser(user);
        this.nameSuccess = 'Nome atualizado com sucesso!';
        this.isUpdatingName = false;
      },
      error: (err) => {
        this.nameError = err.error?.error || 'Erro ao atualizar nome.';
        this.isUpdatingName = false;
      },
    });
  }

  changePassword(): void {
    if (!this.currentPassword || !this.newPassword) {
      this.passwordError = 'Preencha todos os campos.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.passwordError = 'A nova senha deve ter no mínimo 6 caracteres.';
      return;
    }

    this.isChangingPassword = true;
    this.passwordError = '';
    this.passwordSuccess = '';

    this.apiService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.passwordSuccess = 'Senha alterada com sucesso!';
        this.currentPassword = '';
        this.newPassword = '';
        this.isChangingPassword = false;
      },
      error: (err) => {
        this.passwordError = err.error?.error || 'Erro ao alterar senha.';
        this.isChangingPassword = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
