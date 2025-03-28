import { Component } from '@angular/core';
import { AdminCurdService } from '../../shared/_service/admin-curd.service';
import { Subscription } from 'rxjs';
import { get } from 'http';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  records: any[] = [];
  singleRecord: any = null;

  subscription = new Subscription();

  constructor(
    private apiService: AdminCurdService,
  ) { }

  ngOnInit() {
    this.getItems();
  }

  getItems() {
    this.subscription.add(
      this.apiService.getAll('item').subscribe({
        next: (data) => { console.log('Data:', data); },
        error: (error) => { console.error('There was an error!', error); },
        complete: () => { console.log('Completed'); }
      })
    )
  }
  // Get all records
  getAllRecords(): void {
    this.apiService.getAll('users').subscribe({
      next: (response) => {
        this.records = response;
        console.log('All Records:', response);
      },
      error: (error) => console.error('Error:', error),
      complete: () => console.log('Completed fetching all records')
    });
  }

  // Get a single record
  getRecordById(id: number): void {
    this.apiService.getById('users', id).subscribe({
      next: (response) => {
        this.singleRecord = response;
        console.log('Single Record:', response);
      },
      error: (error) => console.error('Error:', error),
      complete: () => console.log('Completed fetching single record')
    });
  }

  // Create a record
  createRecord(): void {
    const data = { name: 'John Doe', email: 'john@example.com' };
    this.apiService.create('users', data).subscribe({
      next: (response) => console.log('Created:', response),
      error: (error) => console.error('Error:', error),
      complete: () => console.log('Completed record creation')
    });
  }

  // Update a record
  updateRecord(id: number): void {
    const updatedData = { name: 'Jane Doe' };
    this.apiService.update('users', id, updatedData).subscribe({
      next: (response) => console.log('Updated:', response),
      error: (error) => console.error('Error:', error),
      complete: () => console.log('Completed record update')
    });
  }

  // Delete a record
  deleteRecord(id: number): void {
    this.apiService.delete('users', id).subscribe({
      next: (response) => console.log('Deleted:', response),
      error: (error) => console.error('Error:', error),
      complete: () => console.log('Completed record deletion')
    });
  }
}
