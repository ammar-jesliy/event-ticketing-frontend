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

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
    {path: 'events', component: EventsComponent, canActivate: [authGuard]},
    {path: 'transactions', component: TransactionsComponent, canActivate: [authGuard]},
    {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
    {path: 'sell-tickets', component: SellTicketsComponent, canActivate: [authGuard]},
    {path: '**', component: PageNotFoundComponent}
];