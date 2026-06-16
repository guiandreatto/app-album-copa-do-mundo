import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonSpinner,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { copyOutline, swapHorizontalOutline } from 'ionicons/icons';
import { StickerService } from '../../services/sticker.service';
import { StickerWithQuantity } from '../../interfaces/models';

@Component({
  selector: 'app-repeated',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-title>
          <ion-icon name="copy-outline" aria-hidden="true"></ion-icon>
          Figurinhas Repetidas
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="repeated-content">
      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div *ngIf="isLoading" class="loading-container">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
        <p>Carregando repetidas...</p>
      </div>

      <div *ngIf="!isLoading" class="repeated-wrapper">
        <!-- Resumo -->
        <div class="summary-card" *ngIf="stickers.length > 0">
          <ion-icon name="swap-horizontal-outline" aria-hidden="true"></ion-icon>
          <div>
            <span class="summary-value">{{ totalRepeated }}</span>
            <span class="summary-label">figurinhas disponíveis para troca</span>
          </div>
        </div>

        <!-- Lista -->
        <div class="sticker-list" *ngIf="stickers.length > 0">
          <div *ngFor="let sticker of stickers" class="sticker-card">
            <div class="sticker-number">
              <span>#{{ sticker.sticker_number }}</span>
            </div>
            <div class="sticker-info">
              <span class="player-name">{{ sticker.player_name }}</span>
              <span class="player-details">{{ sticker.country }} · {{ sticker.position }}</span>
            </div>
            <div class="sticker-quantity">
              <ion-badge color="warning">
                {{ sticker.quantity - 1 }}x
              </ion-badge>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="stickers.length === 0" class="empty-state">
          <ion-icon name="copy-outline" aria-hidden="true"></ion-icon>
          <h3>Nenhuma figurinha repetida</h3>
          <p>Quando você tiver figurinhas em duplicata, elas aparecerão aqui.</p>
        </div>
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

      .repeated-content {
        --background: #f0f2f5;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 50vh;
        color: #666;
      }

      .repeated-wrapper {
        padding: 16px;
        padding-bottom: 100px;
      }

      .summary-card {
        background: linear-gradient(135deg, #ff9800, #f57c00);
        border-radius: 14px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        color: white;
        margin-bottom: 16px;
        box-shadow: 0 4px 16px rgba(255, 152, 0, 0.3);
      }

      .summary-card ion-icon {
        font-size: 32px;
        min-width: 32px;
      }

      .summary-value {
        display: block;
        font-size: 28px;
        font-weight: 700;
      }

      .summary-label {
        display: block;
        font-size: 13px;
        opacity: 0.9;
      }

      .sticker-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .sticker-card {
        background: white;
        border-radius: 12px;
        padding: 14px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        border-left: 4px solid #ff9800;
      }

      .sticker-number {
        min-width: 42px;
        height: 42px;
        border-radius: 10px;
        background: linear-gradient(135deg, #f57c00, #ff9800);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .sticker-number span {
        color: white;
        font-weight: 700;
        font-size: 12px;
      }

      .sticker-info {
        flex: 1;
        min-width: 0;
      }

      .player-name {
        display: block;
        font-weight: 600;
        color: #212121;
        font-size: 14px;
      }

      .player-details {
        display: block;
        color: #757575;
        font-size: 11px;
        margin-top: 2px;
      }

      .sticker-quantity {
        text-align: center;
        min-width: 55px;
      }

      .sticker-quantity ion-badge {
        font-size: 14px;
        padding: 4px 10px;
        border-radius: 8px;
        font-weight: 700;
      }

      .extra-label {
        display: block;
        font-size: 10px;
        color: #999;
        margin-top: 2px;
      }

      .empty-state {
        text-align: center;
        padding: 64px 24px;
        color: #999;
      }

      .empty-state ion-icon {
        font-size: 64px;
        margin-bottom: 16px;
        color: #ccc;
      }

      .empty-state h3 {
        color: #666;
        font-size: 18px;
        margin: 0 0 8px;
      }

      .empty-state p {
        font-size: 14px;
        max-width: 280px;
        margin: 0 auto;
      }
    `,
  ],
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonSpinner,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
  ],
})
export class RepeatedPage implements OnInit {
  stickers: StickerWithQuantity[] = [];
  isLoading = true;
  totalRepeated = 0;

  constructor(private stickerService: StickerService) {
    addIcons({
      'copy-outline': copyOutline,
      'swap-horizontal-outline': swapHorizontalOutline,
    });
  }

  ngOnInit(): void {
    this.loadRepeated();
  }

  ionViewWillEnter(): void {
    this.loadRepeated();
  }

  loadRepeated(): void {
    this.isLoading = true;
    this.stickerService.getRepeated().subscribe({
      next: (stickers) => {
        this.stickers = stickers;
        this.totalRepeated = stickers.reduce((sum, s) => sum + (s.quantity - 1), 0);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  doRefresh(event: any): void {
    this.stickerService.getRepeated().subscribe({
      next: (stickers) => {
        this.stickers = stickers;
        this.totalRepeated = stickers.reduce((sum, s) => sum + (s.quantity - 1), 0);
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      },
    });
  }
}
