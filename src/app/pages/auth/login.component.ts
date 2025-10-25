import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator.component';
import { AuthService } from '../service/auth.service';
import { MessageService } from 'primeng/api';
import { delay, switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
  templateUrl: `./login.component.html`
})
export class Login {
  username: string = '';
  password: string = '';
  checked: boolean = false;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  onLogin(): void {
    if (!this.username || !this.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Informe usuário e senha para continuar.'
      });
      return;
    }

    this.loading = true;

    this.authService.login({ username: this.username, password: this.password }).pipe(
      delay(300), // pequeno atraso para o navegador aplicar os cookies HttpOnly
      switchMap(() => this.authService.validateToken())
    ).subscribe({
      next: () => {
        this.loading = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Login realizado com sucesso!'
        });

        this.router.navigate(['/app']);
      },
      error: () => {
        this.loading = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao validar token. Faça login novamente.'
        });
      }
    });
  }
}

