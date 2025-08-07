import { Role } from './role';

export class Customer {
  id!: string;
  title!: string;
  firstName!: string;
  lastName!: string;
  bed!: number;
  noOfDays!: number;
  isDeleting: boolean = false;
}
