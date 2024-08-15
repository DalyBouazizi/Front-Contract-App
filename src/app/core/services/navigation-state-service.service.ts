import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateServiceService {

  constructor() { }
  private addedUser: boolean = false;
  private addedEmp: boolean = false;

  setUserAdded(state: boolean) {
    this.addedUser = state;}

  isUserAdded(): boolean {
    return this.addedUser;}

  setEmpAdded(state: boolean) {
    this.addedEmp = state;}

  isEmpAdded(): boolean {
    return this.addedEmp;}
}
