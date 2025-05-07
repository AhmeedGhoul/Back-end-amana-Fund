export interface Police {
  idPolice: number;
  active: boolean;
  start: Date | null;
  end: Date | null;
  amount: number;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY';
  renewalDate: Date | null;
  userId: number;
}
