export interface Account {
  id?: number;
  date_Opening?: string;
  accountType?: string;
  amount?: number;
  rib?: string;
  clientEmail?: string;
  agent?: any | null;
  zakatTransactions?: any[];
  zakatTransactionDates?: any[];
  nissabReachedDate?: string | null;
  interestRate?: number | null;
  eligibleForZakat?: boolean;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
}