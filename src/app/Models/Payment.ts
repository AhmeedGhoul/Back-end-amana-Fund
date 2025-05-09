export class Payment {
  id_payment: number | null = null;
  date_payment: Date = new Date();
  agent: string = '';
  amount: number = 0;
  status: boolean = false;
  method: string = 'cash';
  contractId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data?: Partial<Payment>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  static fromJson(json: any): Payment {
    return new Payment({
      ...json,
      date_payment: json.date_payment ? new Date(json.date_payment) : new Date(),
      createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined
    });
  }

  get formattedDate(): string {
    return this.date_payment.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  get statusText(): string {
    return this.status ? 'Paid' : 'Pending';
  }

  get statusColor(): string {
    return this.status ? 'success' : 'warning';
  }
}
