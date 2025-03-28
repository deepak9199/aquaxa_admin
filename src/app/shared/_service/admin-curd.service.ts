import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { backend_url } from '../_env/env';
const backend = backend_url
@Injectable({
  providedIn: 'root'
})
export class AdminCurdService {
  private apiUrl = `${backend}`;

  constructor(private http: HttpClient) {}

  // Create Record (POST)
  create(tableName: string, data: any, images?: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('table_name', tableName);
    formData.append('data', JSON.stringify(data));

    if (images) {
      images.forEach((image) => {
        formData.append(`images[]`, image);
      });
    }

    return this.http.post<any>(this.apiUrl, formData);
  }

  // Get All Records (GET)
  getAll(tableName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?table_name=${tableName}`);
  }

  // Get Single Record (GET)
  getById(tableName: string, id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?table_name=${tableName}&id=${id}`);
  }

  // Update Record (PUT)
  update(tableName: string, id: number, data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { table_name: tableName, id, data };
    return this.http.put<any>(this.apiUrl, body, { headers });
  }

  // Delete Record (DELETE)
  delete(tableName: string, id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { table_name: tableName, id };
    return this.http.request<any>('delete', this.apiUrl, { headers, body });
  }
}
