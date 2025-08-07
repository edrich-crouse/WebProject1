import { Component } from '@angular/core';

import { AccountService, CustomerService } from '@app/_services';
import { ChartDataSets } from 'chart.js';
import * as moment from 'moment';
import { Color, Label } from 'ng2-charts';
import { first } from 'rxjs/operators';
@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  account = this.accountService.accountValue;
  public isLoading = false;
  public data = [];

  public lineChartData: ChartDataSets[] = [{ data: [], label: 'Customers' }];
  public lineChartLabels: Label[] = moment.monthsShort();
  public lineChartOptions: any = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderColor: 'rgba(0, 0, 0, 1)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor(
    private accountService: AccountService,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.customerService
      .getChart()
      .pipe(first())
      .subscribe((data) => {
        this.data = data.sort(function (a, b) {
          return moment(b.month).month() - moment(a.month).month();
        });
        console.log(
          '🚀 ~ file: home.component.ts ~ line 42 ~ HomeComponent ~ .subscribe ~ data',
          this.data.map((c) => c.numberofdocuments)
        );
        this.lineChartData = [
          {
            data: this.data.map((c) => c.numberofdocuments),
            label: 'Customers',
          },
        ];
        this.isLoading = false;
      });
  }
}
