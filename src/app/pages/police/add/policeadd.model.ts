export type Frequency = 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY';

export class PoliceAdd {
  idPolice?: number;
  active: boolean = true;
  start: Date | null = null;
  end: Date | null = null;
  amount: number = 0;
  frequency: Frequency = 'MONTHLY';
  renewalDate: Date | null = null;
  user: {
    id: number;
  };

  constructor() {
    this.active = true;
    this.start = null;
    this.end = null;
    this.renewalDate = null;
    this.amount = 0;
    this.frequency = 'MONTHLY';
    this.user = { id: 0 };
  }
}
