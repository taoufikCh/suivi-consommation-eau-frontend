import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { ProductService } from './service/product.service';
import { SchoolService } from './service/school.service';
import { NatureExerciceService } from './service/nature-exercice.service';
import { LocalService } from './service/local.service';
import { CompteurService } from './service/compteur.service';
import { ConsommationService } from './service/consommation.service';
import { BordereauService } from './service/bordereau.service';
import { DistrictService } from './service/district.service';
import { RegionService } from './service/region.service';
import { CustomerService } from './service/customer.service';
import { IconService } from './service/icon.service';
import { AuthService } from './service/auth.service';
import { TokenStorageService } from './service/token-storage.service';
import { AppHttpInterceptor } from './interceptors/app-http.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
    declarations: [
        AppComponent, NotfoundComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        BreadcrumbModule,
        ProgressSpinnerModule,

    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS,  useClass: AppHttpInterceptor, multi: true },
         CustomerService, IconService, ProductService, SchoolService, AuthService,TokenStorageService,DistrictService,
         RegionService,NatureExerciceService,LocalService,CompteurService,BordereauService,ConsommationService,
    ],
    bootstrap: [AppComponent]
    
})
export class AppModule { }
