import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '@app/_services';
import { Customer } from '@app/_models';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
  customers!: Customer[];
  customer: Customer = null;
  @ViewChild('content') content: TemplateRef<any>;
  @ViewChild('report') report: TemplateRef<any>;

  formGroup: FormGroup = this.fb.group({
    meals: [0],
    clothes: [0],
    gym: [false],
  });
  constructor(
    private customerService: CustomerService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getAll();
  }
  getAll() {
    this.customerService
      .getAll()
      .pipe(first())
      .subscribe((customers) => (this.customers = customers));
  }
  deleteUser(id: string) {
    const customer = this.customers.find((x) => x.id === id);
    if (!customer) return;
    customer.isDeleting = true;
    this.customerService
      .delete(id)
      .pipe(first())
      .subscribe(
        () => (this.customers = this.customers.filter((x) => x.id !== id))
      );
  }
  addServiceModal(customer) {
    this.modalService.open(this.content);
    this.customer = customer;
  }
  openModal(customer) {
    this.modalService.open(this.report);
    this.customer = customer;
  }
  save() {
    this.customerService
      .addService(this.customer.id, this.formGroup.value)
      .pipe(first())
      .pipe(first())
      .subscribe(() => {
        this.getAll();
        this.modalService.dismissAll();
        this.formGroup.reset();
      });
  }
}
