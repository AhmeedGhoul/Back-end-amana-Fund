export class Police {
  idPolice?: number;
  active: boolean = true;
  start: Date | null;
  end: Date | null;
  amount: number;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY';
  renewalDate: Date | null;
  userId: number;

  constructor() {
    this.active = true;
  }
}
