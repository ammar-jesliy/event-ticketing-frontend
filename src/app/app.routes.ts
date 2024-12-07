import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { authGuard } from './auth.guard';
import { EventsComponent } from './components/events/events.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { ProfileComponent } from './components/profile/profile.component';

import { SellTicketsComponent } from './components/sell-tickets/sell-tickets.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { BuyTicketsComponent } from './components/buy-tickets/buy-tickets.component';
import { ConfigureComponent } from './components/configure/configure.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { allowedRoles: ['vendor'] },
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { allowedRoles: ['admin'] },
  },
  {
    path: 'events',
    component: EventsComponent,
    canActivate: [authGuard],
    data: { allowedRoles: ['admin'] },
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [authGuard],
    data: { allowedRoles: ['customer', 'vendor', 'admin'] },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    data: { allowedRoles: ['customer', 'vendor'] },
  },
  {
    path: 'sell-tickets',
    component: SellTicketsComponent,
    canActivate: [authGuard],
    data: { allowedRoles: ['vendor'] },
  },
  {
    path: 'buy-tickets',
    component: BuyTicketsComponent,
    canActivate: [authGuard],
    data: { allowedRoles: ['customer'] },
  },
  {
    path: 'configure',
    component: ConfigureComponent,
    canActivate: [authGuard],
    data: { allowedRoles: ['admin'] },
  },
  {
    path: 'manage-users',
    component: ManageUsersComponent,
    canActivate: [authGuard],
    data: { allowedRoles: ['admin'] },
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  { path: '**', component: PageNotFoundComponent },
];
