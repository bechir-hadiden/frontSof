import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilesComponent } from './files/files.component';
import { ListFileComponent } from './list-file/list-file.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [  
  {path: 'files', component :FilesComponent},
  {path: 'list', component :ListFileComponent},
  {path: 'login', component :LoginComponent},
  {path: 'register', component :RegisterComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 


  
}
