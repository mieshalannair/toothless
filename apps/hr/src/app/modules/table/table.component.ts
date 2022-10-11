import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { TableService } from './table.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface UserData {
  total: number;
  users: User[];
}

export interface User {
  id: string;
  name: string;
  login: string;
  salary: number;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'toothless-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'login', 'salary'];
  dataSource!: MatTableDataSource<User>;

  private subs = new Subscription();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  users!: User[];
  total!: number;

  length = 50;

  minSalary = 0;
  maxSalary = Number.MAX_SAFE_INTEGER;

  constructor(private tableService: TableService) {}

  ngAfterViewInit() {
    this.subs.add(
      this.tableService.getUsers({}).subscribe(
        (res: UserData) => {
          this.users = res.users;
          this.total = res.total;
          this.dataSource = new MatTableDataSource<User>(this.users);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          // this.dataSource.filterPredicate = this.getFilterPredicate();
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      )
    );
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  applyFilter(min: number, max: number) {
    this.subs.add(
      this.tableService.getUsers({ minSalary: min, maxSalary: max }).subscribe(
        (res: UserData) => {
          this.minSalary = min;
          this.maxSalary = max;
          this.users = res.users;
          this.dataSource = new MatTableDataSource<User>(this.users);
          this.paginator.firstPage(); // bringing back to page one
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      )
    );
  }

  /* this method well be called for each row in table  */
  // getFilterPredicate() {
  //   return (data: User, filters: string) => {
  //     // split string per '$' to array
  //     const filterArray = filters.split('$');
  //     const min = Number(filterArray[0]) || 0;
  //     const max = Number(filterArray[1]) || Number.MAX_SAFE_INTEGER;

  //     const matchFilter = [];
  //     const customFilterSalary = min <= data.salary && max >= data.salary;

  //     // push boolean values into array
  //     matchFilter.push(customFilterSalary);
  //     return matchFilter.every(Boolean);
  //   };
  // }

  onPageChange(event: PageEvent) {
    this.subs.add(
      this.tableService
        .getUsers({ offset: event.pageIndex, limit: event.pageSize })
        .subscribe(
          (res: UserData) => {
            this.users = res.users;
            this.dataSource = new MatTableDataSource<User>(this.users);
          },
          (err: HttpErrorResponse) => {
            console.log(err);
          }
        )
    );
  }

  onSort(event: Sort) {
    this.subs.add(
      this.tableService
        .getUsers({
          sort: `${event.direction === 'desc' ? '-' : ''}${event.active}`,
          minSalary: this.minSalary,
          maxSalary: this.maxSalary,
        })
        .subscribe(
          (res: UserData) => {
            this.users = res.users;
            this.dataSource = new MatTableDataSource<User>(this.users);
          },
          (err: HttpErrorResponse) => {
            console.log(err);
          }
        )
    );
  }
}
