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
            },
            {
                path: 'shuttle',
                loadComponent: () => import('./shuttle/shuttle-list/shuttle-list').then(m => m.ShuttleList)
            },
            {
                path: 'shuttle/new',
                loadComponent: () => import('./shuttle/shuttle-form/shuttle-form').then(m => m.ShuttleForm)
            },
            {
                path: 'shuttle/edit/:id',
                loadComponent: () => import('./shuttle/shuttle-form/shuttle-form').then(m => m.ShuttleForm)
            },
            {
                path: 'shuttle/view/:id',
                loadComponent: () => import('./shuttle/shuttle-view/shuttle-view').then(m => m.ShuttleView)
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
