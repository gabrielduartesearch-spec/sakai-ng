import { Routes } from '@angular/router';
import { Crud } from './crud/crud.component';
import { Empty } from './empty/empty';
import { AuthGuard } from '@/guards/auth.guard';
import { Notfound } from './notfound/notfound';

export default [
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '', redirectTo: '/crud', pathMatch: 'full' }
    /* { path: '**', component: Notfound} */
] as Routes;
