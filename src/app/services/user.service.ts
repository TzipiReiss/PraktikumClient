import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Child from '../models/Child';
import User from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(public http: HttpClient) { }
  addChild: boolean;

  currentChild: Child = new Child(0, null, null, null, 0);
  c: Child[] = []
  currentUser: User = new User(0, null, null, null, null, null, null, this.c);

  baseRouteUrl = environment.baseUrl
  getAllUsers() {
    return this.http.get<User[]>(this.baseRouteUrl)
  }
  getUserById(id: number) {
    return this.http.get<User>(`${this.baseRouteUrl}/User/${id}`);
  }
  addUser(user: User) {
    return this.http.post<User>(`${this.baseRouteUrl}/User`, user);
  }
  // addUserChild(c: Child) {
  //   return this.http.post<Child>(`${this.baseRouteUrl}/Child`, c);
  // }
}