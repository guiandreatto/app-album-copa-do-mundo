import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardStats, User } from '../interfaces/models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Obtém as estatísticas do dashboard.
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Obtém o perfil do usuário.
   */
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Atualiza o nome do usuário.
   */
  updateProfile(name: string): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/profile`,
      { name },
      { headers: this.getHeaders() }
    );
  }

  /**
   * Altera a senha do usuário.
   */
  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/profile/password`,
      { currentPassword, newPassword },
      { headers: this.getHeaders() }
    );
  }
}
