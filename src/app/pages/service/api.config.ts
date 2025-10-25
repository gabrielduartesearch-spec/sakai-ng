import { environment } from '@/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfig {

  private readonly apiUrl = environment.apiBaseUrl;

  getBaseUrl(): string {
    return this.apiUrl;
  }

  getEndpoint(path: string): string {
    return `${this.apiUrl}/${path}`;
  }
}
