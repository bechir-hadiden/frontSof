import { Injectable } from '@angular/core';
import { User } from '../Model/userModel';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedUser!: string;
  public isloggedIn: Boolean = false;
  public roles!: string[];
  public regitredUser: User = new User();
  user = new User();

  token!: string;


  apiUser: string = "http://localhost:8084/sofasoufa/api/files/saveUser";


  constructor(private router: Router, private http: HttpClient) { }


  setRegistredUser(user: User) {
    this.regitredUser = user;
  }
  getRegistredUser() {
    return this.regitredUser;
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
    this.token = token;
  }


  saveUserName(userName: string): Observable<any> {
    const params = new HttpParams().set('username', userName);
    return this.http.post(this.apiUser, null, { params });
  }
  
  login(user: User) {
    console.log('URL utilisée pour la requête:', this.apiUser);
    return this.http.post<User>(this.apiUser , user, { observe: 'response' });
  }

  logout() {
    this.loggedUser = undefined!;
    this.roles = undefined!;
    this.token = undefined!;
    this.isloggedIn = false;
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

  setLoggedUserFromLocalStorage(login: string) {
    this.loggedUser = login;
    this.isloggedIn = true;
    // this.getUserRoles(login);
  }

  loadToken() {
    this.token = localStorage.getItem('jwt')!;
  }



  isAdmin(): Boolean {
    if (!this.roles)
      return false;
    return this.roles.indexOf('ADMIN') >= 0;
  }


  registerUser(user: User) {
       // const token = localStorage.getItem('token'); // Assurez-vous que le token est bien stocké ici
    // const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.post<User>(this.apiUser + '/register', user, { observe: 'response' });
  }




}