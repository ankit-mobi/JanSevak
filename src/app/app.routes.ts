import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [


    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            {
               path: 'dashboard',
               loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
            },
            {
                path: 'profile',
                loadComponent: () => import('./profile/profile').then(m => m.Profile),
            },
            {
                path: 'complaints',
                loadComponent: () => import('./complaints/complaint-list/complaint-list').then(m => m.ComplaintList)
            },
            {
                path: 'complaints/view/:id',
                loadComponent: () => import('./complaints/complaint-detail/complaint-detail').then(m => m.ComplaintDetail)
            }
        ]
    },
    
    //  Login Page
    {
        path: 'login',
        component: Login,
        canActivate: [guestGuard]
    }
];
