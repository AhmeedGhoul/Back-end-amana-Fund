export interface Police {
  idPolice: number;
  active: boolean;
  start: Date;
  end: Date;
  amount: number;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY';
  renewalDate: Date;
  userId: number;
}