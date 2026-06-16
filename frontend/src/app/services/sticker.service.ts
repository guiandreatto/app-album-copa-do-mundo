import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StickerWithQuantity } from '../interfaces/models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class StickerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Retorna os headers com o token JWT.
   */
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Lista as figurinhas do usuário com filtros opcionais.
   */
  getUserStickers(filter?: string, search?: string): Observable<StickerWithQuantity[]> {
    let params: any = {};
    if (filter) params.filter = filter;
    if (search) params.search = search;

    return this.http.get<StickerWithQuantity[]>(`${this.apiUrl}/user-stickers`, {
      headers: this.getHeaders(),
      params,
    });
  }

  /**
   * Atualiza a quantidade de uma figurinha.
   */
  updateQuantity(stickerId: number, quantity: number): Observable<StickerWithQuantity> {
    return this.http.put<StickerWithQuantity>(
      `${this.apiUrl}/user-stickers/${stickerId}`,
      { quantity },
      { headers: this.getHeaders() }
    );
  }

  /**
   * Lista figurinhas repetidas.
   */
  getRepeated(): Observable<StickerWithQuantity[]> {
    return this.http.get<StickerWithQuantity[]>(`${this.apiUrl}/user-stickers/repeated`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Lista países disponíveis.
   */
  getCountries(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/stickers/countries`, {
      headers: this.getHeaders(),
    });
  }
}
