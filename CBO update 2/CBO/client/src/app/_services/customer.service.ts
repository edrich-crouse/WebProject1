import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Customer } from '@app/_models';

const baseUrl = `${environment.apiUrl}/customers`;

@Injectable({ providedIn: 'root' })
export class CustomerService {
  constructor(private http: HttpClient) {}

  getChart() {
    return this.http.get<any[]>(`${baseUrl}/chart`);
  }

  getAll() {
    return this.http.get<Customer[]>(baseUrl);
  }

  getById(id: string) {
    return this.http.get<Customer>(`${baseUrl}/${id}`);
  }

  create(params: any) {
    return this.http.post(baseUrl, params);
  }

  update(id: string, params: any) {
    return this.http.put(`${baseUrl}/${id}`, params);
  }

  delete(id: string) {
    return this.http.delete(`${baseUrl}/${id}`);
  }
  addService(id: string, params) {
    return this.http.post(`${baseUrl}/${id}/add-service`, params);
  }
}
