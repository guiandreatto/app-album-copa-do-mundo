import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  footballOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  copyOutline,
  trophyOutline,
  ribbonOutline,
} from 'ionicons/icons';
import { ApiService } from '../../services/api.service';
import { DashboardStats, CountryProgress } from '../../interfaces/models';

@Component({
  selector: 'app-dashboard',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-title>
          <ion-icon name="football-outline" aria-hidden="true"></ion-icon>
          Dashboard
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="dashboard-content">
      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div *ngIf="isLoading" class="loading-container">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
        <p>Carregando estatísticas...</p>
      </div>

      <div *ngIf="!isLoading && stats" class="dashboard-wrapper">
        <!-- Barra de progresso principal -->
        <div class="progress-hero">
          <div class="progress-circle">
            <svg viewBox="0 0 120 120" class="circular-progress">
              <circle class="progress-bg" cx="60" cy="60" r="52" />
              <circle
                class="progress-fill"
                cx="60"
                cy="60"
                r="52"
                [style.stroke-dasharray]="circumference"
                [style.stroke-dashoffset]="progressOffset"
              />
            </svg>
            <div class="progress-text">
              <span class="percentage">{{ stats.completionPercentage }}%</span>
              <span class="label">Completo</span>
            </div>
          </div>
          <h2>Progresso do Álbum</h2>
        </div>

        <!-- Cards de estatísticas -->
        <div class="stats-grid">
          <div class="stat-card total">
            <ion-icon name="football-outline" aria-hidden="true"></ion-icon>
            <div class="stat-info">
              <span class="stat-value">{{ stats.total }}</span>
              <span class="stat-label">Total</span>
            </div>
          </div>

          <div class="stat-card obtained">
            <ion-icon name="checkmark-circle-outline" aria-hidden="true"></ion-icon>
            <div class="stat-info">
              <span class="stat-value">{{ stats.obtained }}</span>
              <span class="stat-label">Obtidas</span>
            </div>
          </div>

          <div class="stat-card missing">
            <ion-icon name="close-circle-outline" aria-hidden="true"></ion-icon>
            <div class="stat-info">
              <span class="stat-value">{{ stats.missing }}</span>
              <span class="stat-label">Faltantes</span>
            </div>
          </div>

          <div class="stat-card repeated">
            <ion-icon name="copy-outline" aria-hidden="true"></ion-icon>
            <div class="stat-info">
              <span class="stat-value">{{ stats.repeated }}</span>
              <span class="stat-label">Repetidas</span>
            </div>
          </div>
        </div>

        <!-- Progresso por seleção -->
        <div class="section-header">
          <ion-icon name="trophy-outline" aria-hidden="true"></ion-icon>
          <h3>Progresso por Seleção</h3>
        </div>

        <div class="country-list">
          <div
            *ngFor="let country of stats.countryProgress"
            class="country-card"
            [class.completed]="country.completed"
          >
            <div class="country-header">
              <span class="country-name">{{ getFlag(country.country) }} {{ country.country }}</span>
              <span class="country-count" [class.complete]="country.completed">
                {{ country.obtained }}/{{ country.total }}
                <ion-icon *ngIf="country.completed" name="ribbon-outline" class="complete-icon" aria-label="Seleção completa"></ion-icon>
              </span>
            </div>
            <div class="country-progress-bar">
              <div
                class="country-progress-fill"
                [style.width.%]="(country.obtained / country.total) * 100"
                [class.complete]="country.completed"
              ></div>
            </div>
          </div>
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

      .dashboard-content {
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

      .dashboard-wrapper {
        padding: 16px;
        padding-bottom: 100px;
      }

      /* Progress Hero */
      .progress-hero {
        text-align: center;
        padding: 24px 0 16px;
      }

      .progress-hero h2 {
        color: #1a237e;
        font-size: 18px;
        font-weight: 600;
        margin: 12px 0 0;
      }

      .progress-circle {
        position: relative;
        width: 140px;
        height: 140px;
        margin: 0 auto;
      }

      .circular-progress {
        transform: rotate(-90deg);
        width: 140px;
        height: 140px;
      }

      .progress-bg {
        fill: none;
        stroke: #e0e0e0;
        stroke-width: 8;
      }

      .progress-fill {
        fill: none;
        stroke: #4caf50;
        stroke-width: 8;
        stroke-linecap: round;
        transition: stroke-dashoffset 1s ease;
      }

      .progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
      }

      .percentage {
        display: block;
        font-size: 28px;
        font-weight: 700;
        color: #2e7d32;
      }

      .progress-text .label {
        display: block;
        font-size: 12px;
        color: #666;
      }

      /* Stats Grid */
      .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 24px;
      }

      .stat-card {
        background: white;
        border-radius: 14px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        transition: transform 0.2s;
      }

      .stat-card:active {
        transform: scale(0.98);
      }

      .stat-card ion-icon {
        font-size: 28px;
        min-width: 28px;
      }

      .stat-card.total ion-icon { color: #1a237e; }
      .stat-card.obtained ion-icon { color: #2e7d32; }
      .stat-card.missing ion-icon { color: #e53935; }
      .stat-card.repeated ion-icon { color: #f57c00; }

      .stat-card.total { border-left: 4px solid #1a237e; }
      .stat-card.obtained { border-left: 4px solid #2e7d32; }
      .stat-card.missing { border-left: 4px solid #e53935; }
      .stat-card.repeated { border-left: 4px solid #f57c00; }

      .stat-info {
        display: flex;
        flex-direction: column;
      }

      .stat-value {
        font-size: 22px;
        font-weight: 700;
        color: #212121;
      }

      .stat-label {
        font-size: 12px;
        color: #757575;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* Section Header */
      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }

      .section-header ion-icon {
        font-size: 22px;
        color: #1a237e;
      }

      .section-header h3 {
        color: #1a237e;
        font-size: 16px;
        font-weight: 600;
        margin: 0;
      }

      /* Country List */
      .country-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .country-card {
        background: white;
        border-radius: 12px;
        padding: 14px 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        transition: all 0.2s;
      }

      .country-card.completed {
        background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
        border: 1px solid #a5d6a7;
      }

      .country-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .country-name {
        font-weight: 600;
        color: #333;
        font-size: 14px;
      }

      .country-count {
        font-weight: 600;
        color: #666;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .country-count.complete {
        color: #2e7d32;
      }

      .complete-icon {
        font-size: 16px;
        color: #ffd600;
      }

      .country-progress-bar {
        height: 6px;
        background: #e0e0e0;
        border-radius: 3px;
        overflow: hidden;
      }

      .country-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #1a237e, #3949ab);
        border-radius: 3px;
        transition: width 0.5s ease;
      }

      .country-progress-fill.complete {
        background: linear-gradient(90deg, #2e7d32, #4caf50);
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
    IonRefresher,
    IonRefresherContent,
  ],
})
export class DashboardPage implements OnInit {
  stats: DashboardStats | null = null;
  isLoading = true;

  // SVG circular progress
  readonly circumference = 2 * Math.PI * 52;
  progressOffset = this.circumference;

  // Mapa de bandeiras por país
  private flags: Record<string, string> = {
    'Brasil': '🇧🇷',
    'Argentina': '🇦🇷',
    'França': '🇫🇷',
    'Alemanha': '🇩🇪',
    'Espanha': '🇪🇸',
    'Portugal': '🇵🇹',
    'Inglaterra': '🇬🇷',
    'Holanda': '🇳🇱',
    'Bélgica': '🇧🇪',
    'Croácia': '🇭🇷',
    'Marrocos': '🇲🇦',
    'Japão': '🇯🇵',
    'Coreia do Sul': '🇰🇷',
    'EUA': '🇺🇸',
    'México': '🇲🇽',
    'Uruguai': '🇺🇾',
    'Senegal': '🇸🇳',
    'Suíça': '🇨🇭',
    'Dinamarca': '🇩🇰',
    'Polônia': '🇵🇱',
  };

  constructor(private apiService: ApiService) {
    addIcons({
      'football-outline': footballOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'close-circle-outline': closeCircleOutline,
      'copy-outline': copyOutline,
      'trophy-outline': trophyOutline,
      'ribbon-outline': ribbonOutline,
    });
  }

  ngOnInit(): void {
    this.loadStats();
  }

  ionViewWillEnter(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.apiService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.isLoading = false;
        // Animate progress circle
        setTimeout(() => {
          const percentage = stats.completionPercentage / 100;
          this.progressOffset = this.circumference * (1 - percentage);
        }, 100);
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  doRefresh(event: any): void {
    this.apiService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        const percentage = stats.completionPercentage / 100;
        this.progressOffset = this.circumference * (1 - percentage);
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      },
    });
  }

  getFlag(country: string): string {
    return this.flags[country] || '🏳️';
  }
}
