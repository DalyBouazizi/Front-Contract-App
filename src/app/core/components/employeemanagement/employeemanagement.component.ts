import { Component,ViewChild, } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationStateServiceService } from '../../services/navigation-state-service.service';
import { EmployeeModel } from '../../models/EmployeeModel.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EmployeeDetailDialogComponent } from '../employee-detail-dialog/employee-detail-dialog.component';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { FilterCriteria } from '../../models/filterCriteriaModel.model';
import { HttpParams } from '@angular/common/http';
import * as DataTables from 'datatables.net';
import * as XLSX from 'xlsx'; // Import xlsx library


@Component({
  selector: 'app-employeemanagement',
  templateUrl: './employeemanagement.component.html',
  styleUrl: './employeemanagement.component.css'
})
export class EmployeemanagementComponent {

  emps: EmployeeModel[] = [];
  filter: FilterCriteria = new FilterCriteria();
  dtOptions: Config = {};

  @ViewChild(DataTableDirective, {static: false})
dtElement!: DataTableDirective;

  selectedPositions: string[] = [];
  jobPositions: string[] = ['HR Assistant', 'HR Manager', '	IT Administrator', 'Analyst']; // Job positions for dropdown
  selectedCategory: string[] = [];
  Category: string[] = ['Administration', 'Finance', 'HR', 'Marketing']; // Job positions for dropdown
   minAge: number | undefined;
  maxAge: number | undefined;
  minSalary: number | undefined;
  maxSalary: number | undefined;
  dropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter:false,
    itemsShowLimit: 0,
  };



  dtTrigger:Subject<any> = new Subject<any>();
  
  constructor(private employeeservice: EmployeeService, private router: Router,public dialog: MatDialog,
    private snackBar: MatSnackBar, private navigationStateService: NavigationStateServiceService,) { }
  ngOnInit(): void {
    $.fn.dataTable.ext.errMode = 'none';

    this.fetchEmployees(); 
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.dtOptions = {
      
      pagingType: 'full_numbers',
      pageLength: 10, // Set the default number of entries per page
      lengthMenu: [5, 10, 25, 50], // Provide options for users to select the number of entries per page
      // scrollY: '400',
      columns: [
        { data: 'matricule' },
        { data: 'cin' },
        { data: 'nom' },
        { data: 'prenom' },
        { data: 'poste' },
        { data: 'categoriePro' },
        { data: 'salaireb' },
        {},
     
        ],

      language: {
        lengthMenu: '_MENU_ : Numbers of Employees per page  ',
        search: 'Keyword', // Custom search label
      }
      
        
      
    };
  

       if (this.navigationStateService.isEmpAdded()) {
        console.log('here')
         this.snackBar.open('Employee added successfully!', 'Close', {
           duration: 3000,
           verticalPosition: 'top',
           panelClass: ['success-snackbar']
         });
         this.navigationStateService.setEmpAdded(false); // Reset state
       }
       if (this.navigationStateService.isEmpUpdated()) {
        console.log('here')
         this.snackBar.open('Employee updated successfully!', 'Close', {
           duration: 3000,
           verticalPosition: 'top',
           panelClass: ['success-snackbar']
         });
         this.navigationStateService.setEmpUpdated(false); // Reset state
       }

  }
// import export --------------------

  exportToExcel(): void {
    // Create a new workbook and add a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.emps);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');

    // Save the workbook to a file
    XLSX.writeFile(wb, 'employees.xlsx');
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); // Trigger file input click
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        const binaryString = e.target.result;
        const workbook = XLSX.read(binaryString, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Read sheet as JSON

        

        // Assuming data is an array of arrays and you want to convert it to a suitable format
        const employees: EmployeeModel[] = data.slice(1).map((row: any) => {
          return {
            matricule: row[0],
            nom: row[1],
            prenom: row[2],
            poste: row[3],
            adresse: row[4],
            dateNaissance: row[5],
            lieuNaissance: row[6],
            cin: String(row[7]),
            dateCin: row[8],
            categoriePro: row[9],
            salaireb: row[10],
            salairen: row[11],
          };
        });
        console.log('Employees:', employees);

        // Convert the array to a JSON string
      // const payload = JSON.stringify(employees);
        // Send data to your API
        this.employeeservice.addListEmployee(employees)
          .subscribe({
            next: (response) => {
              console.log( response);
                // Display snackbar with the response message
            this.snackBar.open(response, 'Close', {
              duration: 6000,
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });

            // Refresh the data table
            this.fetchEmployees();

            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.clear(); // Clear the table
              dtInstance.rows.add(this.emps); // Add the filtered data
    
              dtInstance.draw(); // Redraw the table
            });
            },
            error: (error) => {
              console.error( error);
            }
          });
      };
      
      reader.readAsBinaryString(file);
    }
  }

  // Function to convert the data array to your EmployeeModel
  
//--------------------

  resetFilters() {
    this.minAge = undefined;
    this.maxAge = undefined;
    this.minSalary = undefined;
    this.maxSalary = undefined;
    this.selectedPositions = [];
    this.selectedCategory = [];
    this.applyFilters();
  }
  

  applyFilters() {
    
    this.filter.positions = this.selectedPositions;
    this.filter.categories = this.selectedCategory;
      this.filter.minAge= this.minAge;
      this.filter.maxAge= this.maxAge;
      this.filter.minSalary=this.minSalary;
      this.filter.maxSalary=this.maxSalary;
    console.log('Filter criteria:', this.filter);
    let queryParams = [];

    if (this.filter.positions && this.filter.positions.length > 0) {
        queryParams.push(`Positions=${this.filter.positions.join(',')}`);
    }
    if (this.filter.categories && this.filter.categories.length > 0) {
        queryParams.push(`Categories=${this.filter.categories.join(',')}`);
    }
    if (this.filter.minSalary !== null && this.filter.minSalary !== undefined) {
        queryParams.push(`MinSalary=${this.filter.minSalary}`);
    }
    if (this.filter.maxSalary !== null && this.filter.maxSalary !== undefined) {
        queryParams.push(`MaxSalary=${this.filter.maxSalary}`);
    }
    if (this.filter.minAge !== null && this.filter.minAge !== undefined) {
        queryParams.push(`MinAge=${this.filter.minAge}`);
    }
    if (this.filter.maxAge !== null && this.filter.maxAge !== undefined) {
        queryParams.push(`MaxAge=${this.filter.maxAge}`);
    }

    const queryString = queryParams.join('&');
// Use HttpParams to handle query parameters
    let params = new HttpParams();
    queryParams.forEach(param => {
        const [key, value] = param.split('=');
        params = params.append(key, value);
});
    console.log('queryString', queryString);
    console.log('params', params);
    this.fetchFilteredEmployees(params);

    };

  

    fetchEmployees(){
      this.employeeservice.getEmployees().subscribe(
        (data) => {
          this.emps = data;
         
        },
        (error) => {
          console.error('Error fetching employees', error);
        }
      );
    } // Refresh the user list

    deleteEmployee(matricule: number) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result){
              this.employeeservice.deleteEmployee(matricule)
              .subscribe({
                next: (response :string) => {
                  console.log(response);
                  
                    this.snackBar.open('Employee deleted successfully!', 'Close', {
                      duration: 3000,verticalPosition: 'top', panelClass:['success-snackbar'], });

                  this.router.navigate(['/EmployeeCP']);
                  this.fetchEmployees();
                  
                  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance.clear(); // Clear the table
                    dtInstance.rows.add(this.emps); // Add the filtered data
          
                    dtInstance.draw(); // Redraw the table
                  });
          
                },
              error: (error) => {
                console.error('Error status:', error.status);  // Log HTTP status code
                console.error('Error message:', error.message); // Log error message
                
              } })} });}
  openEmployeeDetailDialog(employee: EmployeeModel): void {
    this.dialog.open(EmployeeDetailDialogComponent, {
      data: employee,
      panelClass: 'custom-dialog-container', // Add custom class here
    });
   
  }

  navigateToUpdate(employee: EmployeeModel) {
    
    this.navigationStateService.setEmployeeToUpdate(employee);
    this.router.navigate(['/EmployeeUpdate']);
  }


   fetchFilteredEmployees(filterCriteria: any) {
    this.employeeservice.fetchFilteredEmployees(filterCriteria).subscribe({
      next: (data) => {
        this.emps = data;
        
        console.log('Filtered employees:', this.emps);
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.clear(); // Clear the table
          dtInstance.rows.add(this.emps); // Add the filtered data


          
          dtInstance.draw(); // Redraw the table
        });

       

      },
      error: (error) => {
        this.emps = [];
      }
    });
  }
}
