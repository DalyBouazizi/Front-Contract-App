import { Component } from '@angular/core';
import { UserserviceService } from '../../services/userservice.service';
import { UserGetModel } from '../../models/UserGetModel.model';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrl: './usermanagement.component.css'
})

export class UsermanagementComponent {
  users: UserGetModel[] = [];
   
  constructor(private userService: UserserviceService) { }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
        console.log(this.users); // Check if data is being received
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
    }
    
  }

  

