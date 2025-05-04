export interface Account {
  id?: number | null;
  clientEmail: string;  // Changed from userId
  date_Opening?: string | null;
  accountType?: string | null;
  amount?: number;
  rib: string;
  interestRate?: number;
  agentId?: number;     // New field
}

export interface Page<T> {
  content: T[];
  totalElements: number;
}