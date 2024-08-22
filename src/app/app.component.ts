import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserLoginModel } from './core/models/UserLoginModel.model';
import { AuthService } from './core/services/auth.service';
import { NotifierService } from './core/services/notifier.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Front-end-Contract';
  currentRoute: string = '';
  constructor(private router: Router, private authService : AuthService,private emailNotifierService: NotifierService) {}
  


    ngOnInit(): void {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.urlAfterRedirects;
        }
      });
  
        // this.emailNotifierService.startWeeklyEmailNotifier();
       
     }

  
  
  }
