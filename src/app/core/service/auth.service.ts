import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'isAuthenticated';
  private readonly TOKEN_KEY = 'authToken';

  private helper = new JwtHelperService();

  private apiURL = 'http://localhost:9090/rh/api/users';
  token!: string;

  public loggedUser!: string;
  public userImage!: string;
  public isloggedIn: Boolean = false;
  public roles!: string[];

  constructor(private router: Router, private http: HttpClient) {}

  login(user: User) {
    return this.http.post(this.apiURL + '/login', user, { observe: 'response', responseType: 'text' });
  }

  saveToken(jwt: string) {
    localStorage.setItem('jwt', jwt);
    this.token = jwt;
    this.isloggedIn = true;
    this.decodeJWT();
  }

  getToken(): string {
    return this.token;
  }

  decodeJWT() {
    if (this.token == undefined) return;
    const decodedToken = this.helper.decodeToken(this.token);
    this.roles = decodedToken.roles;
    this.loggedUser = `${decodedToken.nom} ${decodedToken.prenom}`;
    this.userImage = decodedToken.photo;
  }

  isAdmin(): Boolean {
    if (!this.roles) return false;
    return this.roles.indexOf('ADMIN') > -1;
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
  }

  loadToken() {
    this.token = localStorage.getItem('jwt')!;
    if (this.token) {
      this.decodeJWT();
    }
  }

  isTokenExpired(): Boolean {
    return this.helper.isTokenExpired(this.token);
  }

  getCurrentUserFromToken(): User {
    const decodedToken = this.helper.decodeToken(this.token);
    return {
      id: decodedToken.id,
      email: decodedToken.sub,
      nom: decodedToken.nom,
      prenom: decodedToken.prenom,
      photo: decodedToken.photo,
      telephone: decodedToken.telephone,
      soldeConges: decodedToken.soldeConges,
      active: decodedToken.active,
      postes: [{ posteType: decodedToken.poste }],
      roles: [{ roleType: decodedToken.roles }],
      fonctions: [{ fonctionType: decodedToken.fonctions }],
      salaireBase:decodedToken.salaireBase,
      salaireNet:decodedToken.salaireNet,
      prime:decodedToken.prime
    } as User;
  }

  updatePassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    const payload = { currentPassword, newPassword };
    return this.http.put(`${this.apiURL}/updatePassword/${userId}`, payload, { responseType: 'text' });
  }


}
