import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { EdumanModule } from './eduman/eduman.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { DurationFormatPipe } from './providers/pipe/duration-format.pipe';
import { RoundPipe } from './providers/round.pipe';
import { PaymentGatewayComponent } from './eduman/payment-gateway/payment-gateway.component';
import { TrainerDialogModelComponent } from './eduman/trainer-dialog-model/trainer-dialog-model.component';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';
import { SurveyComponent } from './survey/survey.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatIconModule,
    EdumanModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatSelectModule,
    MatRadioModule,
    MatProgressBarModule,
    MatIconModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    ToastrModule.forRoot(),
    NgHttpLoaderModule.forRoot(),
    TrainerDialogModelComponent,
    AngularFireModule.initializeApp(environment.firebase),
    CarouselModule.forRoot() // Import the carousel module

  ],
  declarations: [
    AppComponent,
    DurationFormatPipe,
    RoundPipe,
    PaymentGatewayComponent,  
    CustomSnackbarComponent,
    SurveyComponent
  ],
  providers: [
    DatePipe,AngularFireFunctions,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1080354917779-j98tjgsu2r03l0o0fdvtsq6tc40goguj.apps.googleusercontent.com'
            )
          },
          // {
          //   id: FacebookLoginProvider.PROVIDER_ID,
          //   provider: new FacebookLoginProvider('1771616193331200')
          // }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
