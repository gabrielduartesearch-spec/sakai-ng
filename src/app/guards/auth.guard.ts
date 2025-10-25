import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router'
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@/pages/service/auth.service';
import { ApiConfig } from '@/pages/service/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    
    return this.authService.validateToken().pipe(
      map(() => true),
      
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          
          return this.authService.refreshToken().pipe(
            map(() => true),
          
            catchError(() => {
              this.router.navigate(['/auth/login']);
              
              return of(false);
            })
          );
        }
        
        this.router.navigate(['/auth/login']);
        
        return of(false);
      })
    );
  }
}
