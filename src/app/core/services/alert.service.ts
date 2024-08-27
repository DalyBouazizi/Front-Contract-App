import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { AlertModel } from '../models/AlertModel.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertCountSubject = new BehaviorSubject<number>(0);

  constructor(private http :  HttpClient) {
    this.loadInitialAlertCount();
   }

   private loadInitialAlertCount() {
    this.getAlerts().subscribe(alerts => {
      this.alertCountSubject.next(alerts.length);
    });
  }

   apiUrl  = "http://localhost:5008/api/Alert/";


   getAlerts(): Observable<AlertModel[]> {
     return this.http.get<AlertModel[]>(`${this.apiUrl}GetAllAlerts`).pipe(
      tap(alerts => {
        this.alertCountSubject.next(alerts.length); // Refresh the alert count whenever getAlerts() is called
      })
    );;
   }
   addAlert(alert : AlertModel ) : Observable<string> {
     return this.http.post<string>(`${this.apiUrl}AddAlert`, alert , { responseType: 'text' as 'json' }).pipe(
      tap(() => this.refreshAlertCount()) );   }
     
getAlertbyContractId(id : number): Observable<AlertModel> 
{
  return this.http.get<AlertModel>(`${this.apiUrl}GetAlertByContractId?contractId=${id}`);
}
deleteallalertforContractId(id : number): Observable<string> {
  const url = `${this.apiUrl}DeleteAlertsByContractId?contractId=${id}`;
  return this.http.delete<string>(url,  { responseType: 'text' as 'json' }).pipe(
    tap(() => this.refreshAlertCount()) ); 
}

     deleteAlert(id: number): Observable<string> {
      const url = `${this.apiUrl}DeleteAlert?alertId=${id}`;
      return this.http.delete<string>(url,  { responseType: 'text' as 'json' }).pipe(
        tap(() => this.refreshAlertCount()) ) ;}

      private refreshAlertCount() {
        this.getAlerts().subscribe(alerts => {
          this.alertCountSubject.next(alerts.length);
        });
      }
      getAlertCount(): Observable<number> {
        return this.alertCountSubject.asObservable();
      }
}
