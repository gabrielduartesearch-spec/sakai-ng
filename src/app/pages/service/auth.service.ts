import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from './api.config';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authApiUrl: string;

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfig,
    private router: Router
  ) {
    this.authApiUrl = this.apiConfig.getEndpoint('auth');
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.authApiUrl}/login`, credentials, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.authApiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.router.navigate(['/auth/login']))
    );
  }

  validateToken(): Observable<any> {
    return this.http.get(`${this.authApiUrl}/validate-token`, { withCredentials: true });
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.authApiUrl}/refresh-token`, {}, { withCredentials: true });
  }

  isAuthenticated(): Observable<boolean> {
    return this.validateToken().pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
