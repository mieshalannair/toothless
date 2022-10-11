import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData } from './table.component';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(private http: HttpClient) {}

  getUsers({
    minSalary = 0,
    maxSalary = Number.MAX_SAFE_INTEGER,
    offset = 0,
    limit = 10,
    sort = '+id',
  }: {
    minSalary?: number;
    maxSalary?: number;
    offset?: number;
    limit?: number;
    sort?: string;
  }): Observable<UserData> {
    return this.http.get<UserData>(
      `http://localhost:3333/api/users?minSalary=${minSalary}&maxSalary=${maxSalary}&offset=${offset}&limit=${limit}&sort=${sort}`
    );
  }
}
