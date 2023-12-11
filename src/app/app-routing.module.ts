/*import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from './components/auth/auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
                    { path: 'pages', loadChildren: () => import('./components/pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
                    { path: 'schools', loadChildren: () => import('./components/schools/schools.module').then(m => m.SchoolsModule), canActivate: [AuthGuard] }
                ]
            },
            
            { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { CreateLocalComponent } from './components/create-local/create-local.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { AutorizationGuard } from './guard/autorization.guard';

const routes: Routes = [
  {
    path: '', component: AppLayoutComponent,canActivate: [AuthGuard],
    children: [
      { path: '', loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AutorizationGuard] },
      { path: 'pages', loadChildren: () => import('./components/pages/pages.module').then(m => m.PagesModule) },
      { path: 'schools', loadChildren: () => import('./components/schools/schools.module').then(m => m.SchoolsModule), canActivate: [AutorizationGuard] },
      { path: 'districts', loadChildren: () => import('./components/districts/districts.module').then(m => m.DistrictsModule), canActivate: [AutorizationGuard] },
      { path: 'regions', loadChildren: () => import('./components/regions/regions.module').then(m => m.RegionsModule), canActivate: [AutorizationGuard] },
      { path: 'natureExercices', loadChildren: () => import('./components/nature_exercices/natureExercices.module').then(m => m.NatureExercisesModule), canActivate: [AutorizationGuard] },
      { path: 'typesLocaux', loadChildren: () => import('./components/type_local/typeLocal.module').then(m => m.TypeLocalModule), canActivate: [AutorizationGuard] },
      { path: 'locaux', loadChildren: () => import('./components/locaux/local.module').then(m => m.LocalModule), canActivate: [AutorizationGuard] },
      { path: 'localForms', loadChildren: () => import('./components/create-local/create-local.module').then(m => m.CreateLocalModule), canActivate: [AutorizationGuard] },
      { path: 'compteurs', loadChildren: () => import('./components/compteurs/compteur.module').then(m => m.CompteurModule), canActivate: [AutorizationGuard] },
      { path: 'compteurForms', loadChildren: () => import('./components/compteur/counter.module').then(m => m.CounterModule), canActivate: [AutorizationGuard] },
      { path: 'bordereaux', loadChildren: () => import('./components/bordereaux/bordereaux.module').then(m => m.BordereauxModule), canActivate: [AutorizationGuard] },
      { path: 'consommations', loadChildren: () => import('./components/consommations/consommations.module').then(m => m.ConsommationsModule), canActivate: [AutorizationGuard] },
      { path: 'consommationForms', loadChildren: () => import('./components/consommation/consommation.module').then(m => m.ConsommationModule), canActivate: [AutorizationGuard] },
      { path: 'statistique', loadChildren: () => import('./components/statistiques/statistiques.module').then(m => m.StatistiquesModule), canActivate: [AutorizationGuard] },
      
    ]
  },
  { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
  //{ path: 'landing', loadChildren: () => import('./components/landing/landing.module').then(m => m.LandingModule) },
  { path: 'notfound', component: NotfoundComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'notfound' }, // Change this line to remove the leading slash
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })], // UseHash set to false for HTML5 routing
  exports: [RouterModule]
})
export class AppRoutingModule { }
