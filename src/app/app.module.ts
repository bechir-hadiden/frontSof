import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilesComponent } from './files/files.component';
import { RouterModule } from '@angular/router'; // Assurez-vous de cet import
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SafePipe } from './shared/safe.pipe';
import { ListFileComponent } from './list-file/list-file.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    FilesComponent,
    SafePipe,
    ListFileComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    CommonModule,
    PdfViewerModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    BrowserAnimationsModule, // Nécessaire pour les animations
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
