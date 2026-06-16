import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, User } from '../interfaces/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUser = new BehaviorSubject<User | null>(null);

  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {
    // Restaura o usuário do localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser.next(JSON.parse(savedUser));
    }
  }

  /**
   * Verifica se o usuário está autenticado.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Retorna o token JWT.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Realiza o login.
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser.next(response.user);
      })
    );
  }

  /**
   * Registra um novo usuário.
   */
  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser.next(response.user);
      })
    );
  }

  /**
   * Recuperação de senha (simulada).
   */
  resetPassword(email: string, newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/reset-password`, {
      email,
      newPassword,
    });
  }

  /**
   * Realiza o logout.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.next(null);
  }

  /**
   * Atualiza os dados do usuário no localStorage.
   */
  updateCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.next(user);
  }
}
