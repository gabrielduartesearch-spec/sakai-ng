import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Garante envio de cookies em todas as requisições
  const cloned = req.clone({ withCredentials: true });

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      
      if (error.status === 401 && !isRefreshing) {
        isRefreshing = true;
        
        return authService.refreshToken().pipe(
          switchMap(() => {
            
            isRefreshing = false;
            
            return next(cloned);
          }),
          catchError(err => {
            
            isRefreshing = false;
            authService.logout().subscribe();
            
            router.navigate(['/auth/login']);
            
            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
