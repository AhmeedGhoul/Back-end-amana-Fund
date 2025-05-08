export interface AccountPayment {
  id?: number;
  paymentDate?: string;
  amount: number;
  agencyName: string;
  rib: string;
  [key: string]: any;
}