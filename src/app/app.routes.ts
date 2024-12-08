/**
 * Defines the routes for the Angular application.
 *
 * Routes:
 * - '' (HomeComponent): The home page of the application.
 * - 'login' (LoginComponent): The login page.
 * - 'signup' (SignupComponent): The signup page.
 * - 'dashboard' (DashboardComponent): The vendor dashboard, protected by authGuard, accessible only to 'vendor' role.
 * - 'admin-dashboard' (AdminDashboardComponent): The admin dashboard, protected by authGuard, accessible only to 'admin' role.
 * - 'events' (EventsComponent): The events management page, protected by authGuard, accessible only to 'admin' role.
 * - 'transactions' (TransactionsComponent): The transactions page, protected by authGuard, accessible to 'customer', 'vendor', and 'admin' roles.
 * - 'profile' (ProfileComponent): The user profile page, protected by authGuard, accessible to 'customer' and 'vendor' roles.
 * - 'sell-tickets' (SellTicketsComponent): The ticket selling page, protected by authGuard, accessible only to 'vendor' role.
 * - 'buy-tickets' (BuyTicketsComponent): The ticket buying page, protected by authGuard, accessible only to 'customer' role.
 * - 'configure' (ConfigureComponent): The configuration page, protected by authGuard, accessible only to 'admin' role.
 * - 'manage-users' (ManageUsersComponent): The user management page, protected by authGuard, accessible only to 'admin' role.
 * - 'unauthorized' (UnauthorizedComponent): The unauthorized access page.
 * - '**' (PageNotFoundComponent): The page not found component for undefined routes.
 */

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
