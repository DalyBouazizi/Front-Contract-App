import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateServiceService {

  constructor() { }
  private addedUser: boolean = false;

  setUserAdded(state: boolean) {
    this.addedUser = state;}

  isUserAdded(): boolean {
    return this.addedUser;}
}
