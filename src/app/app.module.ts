import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavComponent } from './component/nav/nav.component';
import { SideBarComponent } from './component/side-bar/side-bar.component';
import { FooterComponent } from './component/footer/footer.component';
import { LoadingComponent } from './component/loading/loading.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TicketComponent } from './pages/ticket/ticket.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ForgetPasswordComponent } from './pages/auth/forget-password/forget-password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './shared/_guards/guard';
import { LoadingButtonComponent } from './component/loading-button/loading-button.component';
import { HistoryComponent } from './pages/history/history.component';
import { LodingBarsComponent } from './component/loding-bars/loding-bars.component';
import { LodingCardBarComponent } from './component/loding-card-bar/loding-card-bar.component';
import { authInterceptorProviders } from './shared/_helpers/helpers';
import { AuthService } from './shared/_service/auth.service';
import { BannerComponent } from './pages/banner/banner.component';
import { SpecialOfferComponent } from './pages/special-offer/special-offer.component';
import { DiveInFunComponent } from './pages/dive-in-fun/dive-in-fun.component';
import { OurServicesComponent } from './pages/our-services/our-services.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    SideBarComponent,
    FooterComponent,
    LoadingComponent,
    PageNotFoundComponent,
    LoginComponent,
    LogoutComponent,
    DashboardComponent,
    TicketComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ProfileComponent,
    LoadingButtonComponent,
    HistoryComponent,
    LodingBarsComponent,
    LodingCardBarComponent,
    BannerComponent,
    SpecialOfferComponent,
    DiveInFunComponent,
    OurServicesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    AuthGuard,
    authInterceptorProviders,
    AuthService,
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
