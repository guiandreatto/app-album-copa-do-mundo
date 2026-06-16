import { Component } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  statsChartOutline,
  albumsOutline,
  copyOutline,
  personOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="dashboard" aria-label="Dashboard">
          <ion-icon name="stats-chart-outline"></ion-icon>
          <ion-label>Dashboard</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="album" aria-label="Meu Álbum">
          <ion-icon name="albums-outline"></ion-icon>
          <ion-label>Álbum</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="repeated" aria-label="Repetidas">
          <ion-icon name="copy-outline"></ion-icon>
          <ion-label>Repetidas</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" aria-label="Perfil">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>Perfil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [
    `
      ion-tab-bar {
        --background: var(--ion-color-dark);
        --color: rgba(255, 255, 255, 0.6);
        --color-selected: var(--ion-color-primary);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: env(safe-area-inset-bottom);
      }

      ion-tab-button {
        --color-selected: #4caf50;
      }
    `,
  ],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  constructor() {
    addIcons({
      'stats-chart-outline': statsChartOutline,
      'albums-outline': albumsOutline,
      'copy-outline': copyOutline,
      'person-outline': personOutline,
    });
  }
}
