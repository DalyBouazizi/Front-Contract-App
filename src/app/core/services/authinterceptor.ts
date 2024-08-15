import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router"; // Import the correct module for Router
import { catchError, Observable, throwError } from "rxjs";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let clonedRequest = req;
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authtoken');
            // console.log('Token stored in localStorage:', localStorage.getItem('authtoken')); // Verify token storage
            if(token) {
                clonedRequest = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        }
        return next.handle(clonedRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Unauthorized, redirect to login
                    this.router.navigate(['/login']);
                }
                return throwError(error);
            })
        );
    }
}
        
