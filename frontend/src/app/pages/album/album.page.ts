import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonSpinner,
  IonButton,
  IonButtons,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  albumsOutline,
  removeOutline,
  addOutline,
  searchOutline,
  gridOutline,
  listOutline,
  add,
  remove,
  close
} from 'ionicons/icons';
import { StickerService } from '../../services/sticker.service';
import { StickerWithQuantity } from '../../interfaces/models';

@Component({
  selector: 'app-album',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-title>
          <ion-icon name="albums-outline" aria-hidden="true"></ion-icon>
          Meu Álbum
        </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="toggleViewMode()" [attr.aria-label]="viewMode === 'list' ? 'Mudar para grade' : 'Mudar para lista'">
            <ion-icon [name]="viewMode === 'list' ? 'grid-outline' : 'list-outline'"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar color="primary" class="search-toolbar">
        <ion-searchbar
          placeholder="Buscar por nome ou país..."
          [(ngModel)]="searchTerm"
          (ionInput)="onSearch()"
          [debounce]="400"
          mode="ios"
          aria-label="Buscar figurinhas"
        ></ion-searchbar>
      </ion-toolbar>
      <ion-toolbar class="segment-toolbar">
        <ion-segment [(ngModel)]="selectedFilter" (ionChange)="onFilterChange()">
          <ion-segment-button value="all">
            <ion-label>Todas</ion-label>
          </ion-segment-button>
          <ion-segment-button value="obtained">
            <ion-label>Obtidas</ion-label>
          </ion-segment-button>
          <ion-segment-button value="missing">
            <ion-label>Faltantes</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content class="album-content">
      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div *ngIf="isLoading" class="loading-container">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
        <p>Carregando figurinhas...</p>
      </div>

      <div *ngIf="!isLoading" class="album-wrapper">
        <p class="results-count">{{ stickers.length }} figurinhas encontradas</p>

        <!-- LIST VIEW -->
        <div class="sticker-list" *ngIf="viewMode === 'list'">
          <div
            *ngFor="let sticker of stickers; trackBy: trackBySticker"
            class="sticker-card"
            [class.obtained]="sticker.quantity >= 1"
            [class.repeated]="sticker.quantity > 1"
            [class.missing]="sticker.quantity === 0"
          >
            <div class="sticker-number">
              <span>#{{ sticker.sticker_number }}</span>
            </div>
            <div class="sticker-info">
              <span class="player-name">{{ sticker.player_name }}</span>
              <span class="player-details">{{ sticker.country }} · {{ sticker.position }}</span>
            </div>
            <div class="sticker-controls">
              <button
                class="qty-btn minus"
                (click)="decreaseQuantity(sticker)"
                [disabled]="sticker.quantity <= 0"
                [attr.aria-label]="'Diminuir quantidade de ' + sticker.player_name"
              >
                <ion-icon name="remove-outline" aria-hidden="true"></ion-icon>
              </button>
              <span class="qty-value" [class.has-sticker]="sticker.quantity > 0">
                {{ sticker.quantity }}
              </span>
              <button
                class="qty-btn plus"
                (click)="increaseQuantity(sticker)"
                [attr.aria-label]="'Aumentar quantidade de ' + sticker.player_name"
              >
                <ion-icon name="add-outline" aria-hidden="true"></ion-icon>
              </button>
            </div>

            <div class="sticker-status" *ngIf="sticker.quantity === 0">
              <ion-badge color="danger">Faltando</ion-badge>
            </div>
            <div class="sticker-status" *ngIf="sticker.quantity === 1">
              <ion-badge color="success">Obtida</ion-badge>
            </div>
            <div class="sticker-status" *ngIf="sticker.quantity > 1">
              <ion-badge color="warning">+{{ sticker.quantity - 1 }} rep.</ion-badge>
            </div>
          </div>
        </div>

        <!-- GRID VIEW -->
        <div class="sticker-grid" *ngIf="viewMode === 'grid'">
          <div
            *ngFor="let sticker of stickers; trackBy: trackBySticker"
            class="grid-item"
            [class.obtained]="sticker.quantity === 1"
            [class.repeated]="sticker.quantity > 1"
            [class.missing]="sticker.quantity === 0"
            (click)="handleGridClick(sticker)"
          >
            <span class="grid-number">{{ sticker.sticker_number }}</span>
            <span class="grid-badge" *ngIf="sticker.quantity > 1">+{{ sticker.quantity - 1 }}</span>
          </div>
        </div>

        <div *ngIf="stickers.length === 0" class="empty-state">
          <ion-icon name="search-outline" aria-hidden="true"></ion-icon>
          <p>Nenhuma figurinha encontrada</p>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      ion-toolbar[color="primary"] {
        --background: linear-gradient(135deg, #1a237e, #2e7d32);
        --color: white;
      }

      .search-toolbar {
        --padding-top: 0;
        --padding-bottom: 8px;
      }

      ion-searchbar {
        --background: rgba(255, 255, 255, 0.15);
        --color: white;
        --placeholder-color: rgba(255, 255, 255, 0.6);
        --icon-color: rgba(255, 255, 255, 0.6);
        --border-radius: 12px;
      }

      .segment-toolbar {
        --background: white;
        --padding-top: 8px;
        --padding-bottom: 8px;
      }

      ion-segment {
        --background: #f0f2f5;
      }

      ion-segment-button {
        --indicator-color: #2e7d32;
        --color-checked: white;
        --color: #666;
        font-size: 13px;
        min-height: 36px;
      }

      ion-title ion-icon {
        margin-right: 8px;
        vertical-align: middle;
      }

      .album-content {
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

      .album-wrapper {
        padding: 12px 16px;
        padding-bottom: 100px;
      }

      .results-count {
        color: #757575;
        font-size: 13px;
        margin: 0 0 12px;
      }

      /* LIST VIEW STYLES */
      .sticker-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .sticker-card {
        background: white;
        border-radius: 12px;
        padding: 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        transition: all 0.2s;
        border-left: 4px solid #e0e0e0;
      }

      .sticker-card.obtained {
        border-left-color: #4caf50;
      }

      .sticker-card.repeated {
        border-left-color: #ff9800;
        background: #fffde7;
      }

      .sticker-card.missing {
        border-left-color: #ef5350;
        opacity: 0.7;
      }

      .sticker-number {
        min-width: 42px;
        height: 42px;
        border-radius: 10px;
        background: linear-gradient(135deg, #1a237e, #3949ab);
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .player-details {
        display: block;
        color: #757575;
        font-size: 11px;
        margin-top: 2px;
      }

      .sticker-controls {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .qty-btn {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }

      .qty-btn.minus {
        background: #ffebee;
        color: #e53935;
      }

      .qty-btn.plus {
        background: #e8f5e9;
        color: #2e7d32;
      }

      .qty-btn:active {
        transform: scale(0.9);
      }

      .qty-btn:disabled {
        opacity: 0.3;
        cursor: default;
      }

      .qty-btn ion-icon {
        font-size: 18px;
      }

      .qty-value {
        min-width: 28px;
        text-align: center;
        font-weight: 700;
        font-size: 16px;
        color: #999;
      }

      .qty-value.has-sticker {
        color: #2e7d32;
      }

      .sticker-status {
        min-width: 65px;
        text-align: right;
      }

      .sticker-status ion-badge {
        font-size: 10px;
        padding: 4px 8px;
        border-radius: 8px;
      }

      /* GRID VIEW STYLES */
      .sticker-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
        gap: 10px;
        padding: 4px 0;
      }

      .grid-item {
        aspect-ratio: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        border: 2px solid transparent;
        position: relative;
        cursor: pointer;
        transition: transform 0.1s;
      }

      .grid-item:active {
        transform: scale(0.92);
      }

      .grid-item.missing {
        background: #f5f5f5;
        border-color: #e0e0e0;
        color: #999;
      }

      .grid-item.obtained {
        background: #e8f5e9;
        border-color: #4caf50;
        color: #2e7d32;
      }

      .grid-item.repeated {
        background: #fffde7;
        border-color: #ff9800;
        color: #f57c00;
      }

      .grid-number {
        font-weight: 700;
        font-size: 18px;
      }

      .grid-badge {
        position: absolute;
        top: -6px;
        right: -6px;
        background: #ff9800;
        color: white;
        font-size: 11px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }

      .empty-state {
        text-align: center;
        padding: 48px 24px;
        color: #999;
      }

      .empty-state ion-icon {
        font-size: 48px;
        margin-bottom: 12px;
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
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,
    IonSpinner,
    IonButton,
    IonButtons,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
  ],
})
export class AlbumPage implements OnInit {
  stickers: StickerWithQuantity[] = [];
  isLoading = true;
  searchTerm = '';
  selectedFilter = 'all';
  viewMode: 'list' | 'grid' = 'list';

  constructor(
    private stickerService: StickerService,
    private actionSheetCtrl: ActionSheetController
  ) {
    addIcons({
      'albums-outline': albumsOutline,
      'remove-outline': removeOutline,
      'add-outline': addOutline,
      'search-outline': searchOutline,
      'grid-outline': gridOutline,
      'list-outline': listOutline,
      'add': add,
      'remove': remove,
      'close': close
    });
  }

  ngOnInit(): void {
    this.loadStickers();
  }

  ionViewWillEnter(): void {
    this.loadStickers();
  }

  loadStickers(): void {
    this.isLoading = true;
    const filter = this.selectedFilter === 'all' ? undefined : this.selectedFilter;
    const search = this.searchTerm || undefined;

    this.stickerService.getUserStickers(filter, search).subscribe({
      next: (stickers) => {
        this.stickers = stickers;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onFilterChange(): void {
    this.loadStickers();
  }

  onSearch(): void {
    this.loadStickers();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
  }

  async handleGridClick(sticker: StickerWithQuantity) {
    const buttons: any[] = [
      {
        text: 'Adicionar (+1)',
        icon: 'add',
        handler: () => {
          this.increaseQuantity(sticker);
        }
      }
    ];

    if (sticker.quantity > 0) {
      buttons.push({
        text: 'Remover (-1)',
        icon: 'remove',
        role: 'destructive',
        handler: () => {
          this.decreaseQuantity(sticker);
        }
      });
    }

    buttons.push({
      text: 'Cancelar',
      icon: 'close',
      role: 'cancel',
      handler: () => {}
    });

    const actionSheet = await this.actionSheetCtrl.create({
      header: `Figurinha #${sticker.sticker_number} - ${sticker.player_name}`,
      subHeader: `Quantidade atual: ${sticker.quantity}`,
      buttons: buttons
    });

    await actionSheet.present();
  }

  increaseQuantity(sticker: StickerWithQuantity): void {
    const newQty = sticker.quantity + 1;
    this.stickerService.updateQuantity(sticker.id, newQty).subscribe({
      next: (updated) => {
        sticker.quantity = updated.quantity;
      },
    });
  }

  decreaseQuantity(sticker: StickerWithQuantity): void {
    if (sticker.quantity <= 0) return;
    const newQty = sticker.quantity - 1;
    this.stickerService.updateQuantity(sticker.id, newQty).subscribe({
      next: (updated) => {
        sticker.quantity = updated.quantity;
      },
    });
  }

  doRefresh(event: any): void {
    const filter = this.selectedFilter === 'all' ? undefined : this.selectedFilter;
    this.stickerService.getUserStickers(filter, this.searchTerm || undefined).subscribe({
      next: (stickers) => {
        this.stickers = stickers;
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      },
    });
  }

  trackBySticker(index: number, sticker: StickerWithQuantity): number {
    return sticker.id;
  }
}
